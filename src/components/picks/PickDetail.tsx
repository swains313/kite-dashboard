'use client';

import React, { useState } from 'react';
import { DailyPick } from '@/types/picks.types';
import { formatINR } from '@/lib/api';

type Tab = 'levels' | 'signals' | 'thesis';

const TABS: { id: Tab; label: string }[] = [
  { id: 'levels', label: 'Levels' },
  { id: 'signals', label: 'Signals' },
  { id: 'thesis', label: 'Why' },
];

/** Signal badges — only the factors that actually fired. */
function chips(pick: DailyPick): { label: string; strong: boolean }[] {
  const f = pick.factors;
  const out: { label: string; strong: boolean }[] = [];
  if (f.minerviniStage === 'STAGE_2') out.push({ label: 'Stage 2', strong: true });
  else if (f.minerviniStage === 'STAGE_1') out.push({ label: 'Stage 1', strong: false });
  out.push({ label: `Trend ${f.trendTemplatePassCount}/8`, strong: f.trendTemplatePassCount === 8 });
  out.push({ label: `RS ${f.rsRanking}`, strong: f.rsRanking >= 85 });
  if (f.vcpDetected) out.push({ label: `VCP ${f.vcpQuality.toLowerCase()}`, strong: true });
  if (f.isPocketPivot) out.push({ label: 'Pocket pivot', strong: true });
  else if (f.volumeZScore >= 1.2) out.push({ label: `Vol +${f.volumeZScore}σ`, strong: false });
  if (f.isVolatilityCompressed) out.push({ label: 'Squeeze', strong: true });
  if (f.lowVolumeNodeBreakout) out.push({ label: 'LVN breakout', strong: false });
  if (f.newsSentimentScore > 0) out.push({ label: `News +${f.newsSentimentScore}`, strong: false });
  return out;
}

/**
 * Detail for the selected pick, split across small tabs so the whole screen
 * fits without scrolling.
 */
export function PickDetail({ pick }: { pick: DailyPick }) {
  const [tab, setTab] = useState<Tab>('levels');

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-50">{pick.symbol}</h2>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
              {pick.mode}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {pick.holdingPeriod} · best of {pick.candidatesEvaluated}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xl font-bold tabular-nums text-slate-50">{pick.convictionScore}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-600">score</div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-800 px-2 py-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-2.5 py-1 text-xs transition ${
              tab === t.id
                ? 'bg-slate-800 font-medium text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'levels' && (
          <div className="space-y-2.5 text-sm">
            <Row label="Buy above" value={formatINR(pick.entryTrigger)} tone="text-slate-100" />
            <Row
              label="Stop loss"
              value={`${formatINR(pick.stopLoss)}  (−${pick.stopLossPercent}%)`}
              tone="text-rose-400"
            />
            <Row
              label="Target 1"
              value={`${formatINR(pick.target1)}  (+${pick.target1Percent}%)`}
              tone="text-emerald-400"
            />
            <Row
              label="Target 2"
              value={`${formatINR(pick.target2)}  (+${pick.target2Percent}%)`}
              tone="text-emerald-400"
            />
            <div className="my-3 border-t border-slate-800" />
            <Row label="Quantity" value={String(pick.suggestedQuantity)} />
            <Row label="Capital" value={formatINR(pick.capitalDeployed)} />
            <Row label="Risk" value={formatINR(pick.riskAmount)} tone="text-rose-300" />
            <Row label="Reward:risk" value={`${pick.riskRewardT1}R at Target 1`} />
          </div>
        )}

        {tab === 'signals' && (
          <div>
            <div className="flex flex-wrap gap-1.5">
              {chips(pick).map((c) => (
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
            <div className="mt-4 space-y-2 border-t border-slate-800 pt-3 text-xs">
              <Row label="ATR (14)" value={String(pick.factors.atr14)} small />
              <Row
                label="Avg volume"
                value={`${(pick.factors.avgVolume20 / 1000).toFixed(0)}k`}
                small
              />
              <Row label="Point of control" value={formatINR(pick.factors.pointOfControl)} small />
              <Row
                label="Mansfield RS"
                value={`${pick.factors.mansfieldRelativeStrength > 0 ? '+' : ''}${pick.factors.mansfieldRelativeStrength}%`}
                small
              />
            </div>
          </div>
        )}

        {tab === 'thesis' && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-slate-300">{pick.thesis}</p>
            {pick.marketSummary && (
              <p className="border-t border-slate-800 pt-3 text-xs leading-relaxed text-slate-500">
                {pick.marketSummary}
              </p>
            )}
            {pick.runnersUp.length > 0 && (
              <p className="text-xs text-slate-600">
                Also ranked: {pick.runnersUp.map((r) => r.symbol).join(', ')}
              </p>
            )}
          </div>
        )}
      </div>

      {pick.tradingAdvised === false && (
        <p className="border-t border-slate-800 bg-amber-500/[0.07] px-4 py-2 text-[11px] text-amber-300/90">
          Not simulated — regime argues against new long risk.
        </p>
      )}
    </section>
  );
}

const Row = ({
  label,
  value,
  tone,
  small,
}: {
  label: string;
  value: string;
  tone?: string;
  small?: boolean;
}) => (
  <div className={`flex justify-between gap-3 ${small ? 'text-xs' : ''}`}>
    <span className="text-slate-500">{label}</span>
    <span className={`font-medium tabular-nums ${tone || 'text-slate-200'}`}>{value}</span>
  </div>
);
