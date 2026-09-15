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

  return (
    <aside className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
        <h2 className="text-xs font-medium uppercase tracking-wider text-slate-500">Track record</h2>

        {!hasData ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            No settled trades yet. Fills in as picks reach their stop or target.
          </p>
        ) : (
          <>
            <div className="mt-3">
              <div className="text-3xl font-semibold tabular-nums text-slate-50">{stats.winRate}%</div>
              <div className="text-xs text-slate-500">
                win rate · {stats.wins}W / {stats.losses}L
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4">
              <Stat label="Net P&L" value={formatINR(stats.totalNetPnL)} positive={stats.totalNetPnL >= 0} />
              <Stat label="Avg R" value={`${stats.avgRMultiple}R`} positive={stats.avgRMultiple >= 0} />
              <Stat
                label="Profit factor"
                value={String(stats.profitFactor)}
                positive={stats.profitFactor >= 1}
              />
              <Stat label="Settled" value={String(stats.totalPicks)} />
            </div>
          </>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
        <h2 className="text-xs font-medium uppercase tracking-wider text-slate-500">Open positions</h2>

        {positions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">None open.</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {positions.map((p) => (
              <li key={p.positionId} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-200">{p.symbol}</div>
                  <div className="text-[11px] tabular-nums text-slate-500">
                    {p.quantity} @ {formatINR(p.entryPrice)}
                  </div>
                </div>
                <div
                  className={`shrink-0 text-right text-sm tabular-nums ${
                    p.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatINR(p.unrealizedPnL)}
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
  <div>
    <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    <div
      className={`mt-0.5 text-sm font-medium tabular-nums ${
        positive === undefined ? 'text-slate-200' : positive ? 'text-emerald-400' : 'text-rose-400'
      }`}
    >
      {value}
    </div>
  </div>
);
