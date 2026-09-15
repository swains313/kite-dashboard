'use client';

import React from 'react';
import { PaperPosition, PerformanceSnapshot } from '@/types/picks.types';
import { formatINR } from '@/lib/api';

/**
 * Paper track record. A-grade is shown on its own — blending it with forced
 * picks would hide the number that decides whether this goes live.
 */
export function PerformancePanel({
  performance,
  positions,
}: {
  performance: PerformanceSnapshot[];
  positions: PaperPosition[];
}) {
  const stats =
    performance.find((p) => p.mode === 'ALL' && p.grade === 'A_GRADE') ||
    performance.find((p) => p.mode === 'ALL' && p.grade === 'ALL');
  const hasData = stats && stats.totalPicks > 0;

  // Profit factor is the honest headline: below 1.0 the system loses money.
  const edge = !hasData
    ? null
    : stats.profitFactor >= 1.3
      ? { label: 'Positive edge', tone: 'text-emerald-400' }
      : stats.profitFactor >= 1.0
        ? { label: 'Break-even', tone: 'text-amber-400' }
        : { label: 'Negative expectancy', tone: 'text-rose-400' };

  return (
    <aside className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Track record
          </h2>
          {edge && <span className={`text-[11px] font-medium ${edge.tone}`}>{edge.label}</span>}
        </div>

        {!hasData ? (
          <p className="px-4 py-5 text-sm leading-relaxed text-slate-500">
            No settled trades yet. Fills in as picks reach their stop or target.
          </p>
        ) : (
          <>
            <div className="px-4 pt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums text-slate-50">
                  {stats.winRate}
                </span>
                <span className="text-lg text-slate-600">%</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                win rate · {stats.wins}W / {stats.losses}L
              </div>

              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="bg-emerald-500" style={{ width: `${stats.winRate}%` }} />
                <div className="bg-rose-500/70" style={{ width: `${100 - stats.winRate}%` }} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-px border-t border-slate-800 bg-slate-800">
              <Stat label="Net P&L" value={formatINR(stats.totalNetPnL)} positive={stats.totalNetPnL >= 0} />
              <Stat label="Avg R" value={`${stats.avgRMultiple}R`} positive={stats.avgRMultiple >= 0} />
              <Stat label="Profit factor" value={String(stats.profitFactor)} positive={stats.profitFactor >= 1} />
              <Stat label="Settled" value={String(stats.totalPicks)} />
            </div>
          </>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Open positions
          </h2>
          {positions.length > 0 && (
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-400">
              {positions.length}
            </span>
          )}
        </div>

        {positions.length === 0 ? (
          <p className="px-4 py-5 text-sm text-slate-500">None open.</p>
        ) : (
          <ul className="divide-y divide-slate-800/70">
            {positions.map((p) => (
              <li key={p.positionId} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-200">{p.symbol}</div>
                  <div className="mt-0.5 text-[11px] tabular-nums text-slate-500">
                    {p.quantity} @ {formatINR(p.entryPrice)}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div
                    className={`text-sm font-medium tabular-nums ${
                      p.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {p.unrealizedPnL >= 0 ? '+' : ''}
                    {formatINR(p.unrealizedPnL)}
                  </div>
                  <div className="mt-0.5 text-[11px] tabular-nums text-slate-500">
                    {formatINR(p.lastPrice)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

const Stat = ({ label, value, positive }: { label: string; value: string; positive?: boolean }) => (
  <div className="bg-slate-900/60 px-4 py-3">
    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
    <div
      className={`mt-1 text-sm font-semibold tabular-nums ${
        positive === undefined ? 'text-slate-200' : positive ? 'text-emerald-400' : 'text-rose-400'
      }`}
    >
      {value}
    </div>
  </div>
);
