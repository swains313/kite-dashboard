'use client';

import React from 'react';
import { DailyPick, PickGrade } from '@/types/picks.types';
import { formatINR } from '@/lib/api';

const GRADE: Record<PickGrade, { label: string; chip: string; bar: string }> = {
  A_GRADE: {
    label: 'Tradeable setup',
    chip: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    bar: 'bg-emerald-500',
  },
  B_GRADE: {
    label: 'Marginal setup',
    chip: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    bar: 'bg-amber-500',
  },
  NO_TRADE_QUALITY: {
    label: 'No qualifying setup',
    chip: 'bg-slate-500/10 text-slate-400 ring-slate-500/20',
    bar: 'bg-slate-600',
  },
};

export function PickCard({ pick }: { pick: DailyPick }) {
  const g = GRADE[pick.grade];

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-semibold text-slate-50">{pick.symbol}</h2>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {pick.mode}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">{pick.companyName}</p>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-2xl font-semibold tabular-nums text-slate-100">
            {pick.convictionScore}
            <span className="text-sm font-normal text-slate-600">/100</span>
          </div>
          <div className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${g.bar}`} style={{ width: `${pick.convictionScore}%` }} />
          </div>
        </div>
      </div>

      {/* Grade */}
      <div className="px-5 pt-4">
        <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium ring-1 ${g.chip}`}>
          {g.label}
        </span>
      </div>

      {/* Levels */}
      <div className="grid grid-cols-2 gap-px bg-slate-800 sm:grid-cols-4 mt-4 mx-5 rounded-lg overflow-hidden border border-slate-800">
        <Cell label="Buy above" value={formatINR(pick.entryTrigger)} />
        <Cell
          label="Stop loss"
          value={formatINR(pick.stopLoss)}
          note={`−${pick.stopLossPercent}%`}
          tone="text-rose-400"
        />
        <Cell
          label="Target 1"
          value={formatINR(pick.target1)}
          note={`+${pick.target1Percent}% · ${pick.riskRewardT1}R`}
          tone="text-emerald-400"
        />
        <Cell
          label="Target 2"
          value={formatINR(pick.target2)}
          note={`+${pick.target2Percent}%`}
          tone="text-emerald-400"
        />
      </div>

      {/* Sizing */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 px-5 text-sm">
        <Inline label="Qty" value={String(pick.suggestedQuantity)} />
        <Inline label="Capital" value={formatINR(pick.capitalDeployed)} />
        <Inline label="Risk" value={formatINR(pick.riskAmount)} />
        <Inline label="Hold" value={pick.mode === 'INTRADAY' ? 'Intraday' : '2–5 days'} />
      </div>

      {/* Thesis */}
      <p className="mt-4 px-5 text-sm leading-relaxed text-slate-400">{pick.thesis}</p>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-5 py-3 text-xs text-slate-500">
        <span>
          Best of {pick.candidatesEvaluated} · data {pick.dataSource}
        </span>
        <span className="rounded bg-slate-800/80 px-2 py-0.5 text-slate-400">
          {pick.outcome.replace(/_/g, ' ').toLowerCase()}
        </span>
      </div>
    </article>
  );
}

const Cell = ({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note?: string;
  tone?: string;
}) => (
  <div className="bg-slate-900/60 p-3">
    <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-1 text-base font-medium tabular-nums ${tone || 'text-slate-100'}`}>{value}</div>
    {note && <div className="text-[11px] tabular-nums text-slate-500">{note}</div>}
  </div>
);

const Inline = ({ label, value }: { label: string; value: string }) => (
  <span className="text-slate-500">
    {label} <span className="ml-1 tabular-nums text-slate-200">{value}</span>
  </span>
);
