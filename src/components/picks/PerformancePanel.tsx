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

  return (
    <aside className="space-y-6 text-sm">
      <section>
        <h2 className="text-xs uppercase tracking-wide text-slate-500">Track record</h2>

        {!stats || stats.totalPicks === 0 ? (
          <p className="mt-3 text-slate-500">
            No settled trades yet. Fills in as picks reach their stop or target.
          </p>
        ) : (
          <dl className="mt-3 space-y-2">
            <Row label="Win rate" value={`${stats.winRate}%`} />
            <Row label="Record" value={`${stats.wins}W / ${stats.losses}L`} />
            <Row label="Net P&L" value={formatINR(stats.totalNetPnL)} />
            <Row label="Average R" value={`${stats.avgRMultiple}R`} />
          </dl>
        )}
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-wide text-slate-500">Open positions</h2>

        {positions.length === 0 ? (
          <p className="mt-3 text-slate-500">None.</p>
        ) : (
          <dl className="mt-3 space-y-2">
            {positions.map((p) => (
              <Row
                key={p.positionId}
                label={`${p.symbol} ×${p.quantity}`}
                value={formatINR(p.unrealizedPnL)}
              />
            ))}
          </dl>
        )}
      </section>
    </aside>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-slate-500">{label}</dt>
    <dd className="tabular-nums text-slate-200">{value}</dd>
  </div>
);
