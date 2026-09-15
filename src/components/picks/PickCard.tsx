'use client';

import React from 'react';
import { DailyPick } from '@/types/picks.types';
import { formatINR } from '@/lib/api';

const GRADE_LABEL: Record<string, string> = {
  A_GRADE: 'Tradeable setup',
  B_GRADE: 'Marginal setup',
  NO_TRADE_QUALITY: 'No qualifying setup — shown for reference',
};

export function PickCard({ pick }: { pick: DailyPick }) {
  const weak = pick.grade === 'NO_TRADE_QUALITY';

  return (
    <section className="rounded-lg border border-slate-800 p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <span className="text-lg font-medium text-slate-100">{pick.symbol}</span>
          <span className="ml-2 text-sm text-slate-500">{pick.mode.toLowerCase()}</span>
        </div>
        <span className="text-sm text-slate-500">{pick.convictionScore}/100</span>
      </div>

      <p className={`mt-1 text-xs ${weak ? 'text-slate-500' : 'text-slate-400'}`}>
        {GRADE_LABEL[pick.grade]}
      </p>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Buy above" value={formatINR(pick.entryTrigger)} />
        <Row label="Stop loss" value={`${formatINR(pick.stopLoss)}  (−${pick.stopLossPercent}%)`} />
        <Row label="Target 1" value={`${formatINR(pick.target1)}  (+${pick.target1Percent}%)`} />
        <Row label="Target 2" value={`${formatINR(pick.target2)}  (+${pick.target2Percent}%)`} />
        <Row label="Quantity" value={`${pick.suggestedQuantity}  ·  risk ${formatINR(pick.riskAmount)}`} />
      </dl>

      <p className="mt-4 border-t border-slate-800/70 pt-3 text-xs leading-relaxed text-slate-500">
        {pick.thesis}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        Best of {pick.candidatesEvaluated} · {pick.outcome.replace(/_/g, ' ').toLowerCase()}
      </p>
    </section>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-slate-500">{label}</dt>
    <dd className="tabular-nums text-slate-200">{value}</dd>
  </div>
);
