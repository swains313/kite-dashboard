'use client';

import React from 'react';
import { DailyPick, PickGrade } from '@/types/picks.types';
import { formatINR } from '@/lib/api';

const GRADE: Record<PickGrade, { label: string; text: string; dot: string; bar: string }> = {
  A_GRADE: {
    label: 'Tradeable setup',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    bar: 'from-emerald-500 to-emerald-400',
  },
  B_GRADE: {
    label: 'Marginal setup',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    bar: 'from-amber-500 to-amber-400',
  },
  NO_TRADE_QUALITY: {
    label: 'No qualifying setup',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    bar: 'from-slate-600 to-slate-500',
  },
};

/** Compact signal badges — only the factors that actually fired. */
function factorChips(pick: DailyPick): { label: string; strong: boolean }[] {
  const f = pick.factors;
  const chips: { label: string; strong: boolean }[] = [];

  if (f.minerviniStage === 'STAGE_2') chips.push({ label: 'Stage 2', strong: true });
  else if (f.minerviniStage === 'STAGE_1') chips.push({ label: 'Stage 1', strong: false });

  chips.push({ label: `Trend ${f.trendTemplatePassCount}/8`, strong: f.trendTemplatePassCount === 8 });
  chips.push({ label: `RS ${f.rsRanking}`, strong: f.rsRanking >= 85 });

  if (f.vcpDetected) chips.push({ label: `VCP ${f.vcpQuality.toLowerCase()}`, strong: true });
  if (f.isPocketPivot) chips.push({ label: 'Pocket pivot', strong: true });
  else if (f.volumeZScore >= 1.2) chips.push({ label: `Vol +${f.volumeZScore}σ`, strong: false });
  if (f.isVolatilityCompressed) chips.push({ label: 'Squeeze', strong: true });
  if (f.lowVolumeNodeBreakout) chips.push({ label: 'LVN breakout', strong: false });
  if (f.newsSentimentScore > 0) chips.push({ label: `News +${f.newsSentimentScore}`, strong: false });

  return chips;
}

export function PickCard({ pick }: { pick: DailyPick }) {
  const g = GRADE[pick.grade];
  const chips = factorChips(pick);
  // The universe falls back to the symbol as a name when Kite is not connected.
  const showCompany = pick.companyName && pick.companyName !== pick.symbol;
  const blocked = pick.tradingAdvised === false;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-slate-800 text-[11px] font-bold text-slate-400">
              {pick.rank || 1}
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50">{pick.symbol}</h2>
            <span className="rounded border border-slate-700/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {pick.mode}
            </span>
          </div>
          {showCompany && <p className="mt-1 truncate text-sm text-slate-500">{pick.companyName}</p>}
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${g.dot}`} />
            <span className={`text-xs font-medium ${g.text}`}>{g.label}</span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="flex items-baseline justify-end gap-0.5">
            <span className="text-3xl font-bold tabular-nums text-slate-50">
              {pick.convictionScore}
            </span>
            <span className="text-sm text-slate-600">/100</span>
          </div>
          <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${g.bar}`}
              style={{ width: `${pick.convictionScore}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-wider text-slate-600">
            conviction
          </div>
        </div>
      </div>

      {/* Levels */}
      <div className="grid grid-cols-2 border-y border-slate-800 sm:grid-cols-4">
        <Cell label="Buy above" value={formatINR(pick.entryTrigger)} accent="text-slate-50" />
        <Cell
          label="Stop loss"
          value={formatINR(pick.stopLoss)}
          note={`−${pick.stopLossPercent}%`}
          accent="text-rose-400"
        />
        <Cell
          label="Target 1"
          value={formatINR(pick.target1)}
          note={`+${pick.target1Percent}% · ${pick.riskRewardT1}R`}
          accent="text-emerald-400"
        />
        <Cell
          label="Target 2"
          value={formatINR(pick.target2)}
          note={`+${pick.target2Percent}%`}
          accent="text-emerald-400"
          last
        />
      </div>

      {/* Sizing */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5 text-sm">
        <Inline label="Qty" value={String(pick.suggestedQuantity)} />
        <Inline label="Capital" value={formatINR(pick.capitalDeployed)} />
        <Inline label="Risk" value={formatINR(pick.riskAmount)} tone="text-rose-300" />
        <Inline label="Hold" value={pick.mode === 'INTRADAY' ? 'Intraday' : '2–5 days'} />
      </div>

      {/* Signals */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-800/70 px-5 py-3.5">
          {chips.map((c) => (
            <span
              key={c.label}
              className={`rounded-md px-2 py-1 text-[11px] font-medium ring-1 ${
                c.strong
                  ? 'bg-slate-800/80 text-slate-200 ring-slate-700'
                  : 'text-slate-500 ring-slate-800'
              }`}
            >
              {c.label}
            </span>
          ))}
        </div>
      )}

      {/* Thesis */}
      <p className="border-t border-slate-800/70 px-5 py-4 text-sm leading-relaxed text-slate-400">
        {pick.thesis}
      </p>

      {blocked && (
        <p className="mx-5 mb-4 rounded-md bg-amber-500/[0.07] px-3 py-2 text-xs text-amber-300/90 ring-1 ring-amber-500/20">
          Not simulated as a trade — the market regime argues against new long risk today.
        </p>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/40 px-5 py-3 text-[11px] text-slate-500">
        <span>
          Ranked 1st of {pick.candidatesEvaluated}
          {pick.runnersUp.length > 0 && (
            <span className="text-slate-600">
              {' '}
              · next: {pick.runnersUp.map((r) => r.symbol).join(', ')}
            </span>
          )}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-slate-600">{pick.dataSource}</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-400">
            {pick.outcome.replace(/_/g, ' ').toLowerCase()}
          </span>
        </span>
      </div>
    </article>
  );
}

const Cell = ({
  label,
  value,
  note,
  accent,
  last,
}: {
  label: string;
  value: string;
  note?: string;
  accent: string;
  last?: boolean;
}) => (
  <div
    className={`border-slate-800 px-4 py-3.5 ${last ? '' : 'sm:border-r'} border-b sm:border-b-0 [&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-r`}
  >
    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-1 text-base font-semibold tabular-nums ${accent}`}>{value}</div>
    {note && <div className="mt-0.5 text-[11px] tabular-nums text-slate-500">{note}</div>}
  </div>
);

const Inline = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <span className="text-slate-500">
    {label}{' '}
    <span className={`ml-0.5 font-medium tabular-nums ${tone || 'text-slate-200'}`}>{value}</span>
  </span>
);
