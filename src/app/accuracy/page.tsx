'use client';

import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { DailyAccuracy, RollingDiagnosis } from '@/types/picks.types';

const VERDICT: Record<string, { text: string; ring: string }> = {
  GOOD: { text: 'text-emerald-400', ring: 'bg-emerald-500/10 ring-emerald-500/25' },
  MIXED: { text: 'text-amber-400', ring: 'bg-amber-500/10 ring-amber-500/25' },
  POOR: { text: 'text-rose-400', ring: 'bg-rose-500/10 ring-rose-500/25' },
  NO_TRADE_DAY: { text: 'text-slate-400', ring: 'bg-slate-500/10 ring-slate-500/25' },
};

/**
 * Was the analysis right? Five picks are published daily and graded at the
 * close — five failing together points at the model, one failing is variance.
 */
export default function Accuracy() {
  const [days, setDays] = useState<DailyAccuracy[]>([]);
  const [rolling, setRolling] = useState<RollingDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const load = () =>
    apiGet<{ rolling: RollingDiagnosis; data: DailyAccuracy[] }>('/api/accuracy')
      .then((r) => {
        setDays(r.data);
        setRolling(r.rolling);
        setError(null);
      })
      .catch((e) => setError((e as Error).message));

  useEffect(() => {
    void load();
  }, []);

  const verifyNow = async () => {
    setVerifying(true);
    try {
      await apiPost('/api/accuracy/verify');
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">Analysis Accuracy</h1>
          <p className="mt-1 text-sm text-slate-500">
            Five picks published daily, graded against where price actually went.
          </p>
        </div>
        <button
          onClick={() => void verifyNow()}
          disabled={verifying}
          className="rounded-md border border-slate-800 px-3 py-1.5 text-sm text-slate-400 transition hover:border-slate-700 hover:text-slate-200 disabled:opacity-50"
        >
          {verifying ? 'Checking…' : 'Check today now'}
        </button>
      </header>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {error}
        </p>
      )}

      {rolling && (
        <section className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
          <div className="border-b border-slate-800 px-5 py-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Rolling verdict · last {rolling.daysAssessed} traded days
            </h2>
          </div>
          <p className="px-5 py-4 text-sm leading-relaxed text-slate-300">{rolling.reading}</p>
          <div className="grid grid-cols-2 gap-px border-t border-slate-800 bg-slate-800 sm:grid-cols-4">
            <Stat label="Target rate" value={`${rolling.avgHitRate}%`} />
            <Stat
              label="Avg basket move"
              value={`${rolling.avgMovePercent > 0 ? '+' : ''}${rolling.avgMovePercent}%`}
              tone={rolling.avgMovePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}
            />
            <Stat label="Good days" value={String(rolling.goodDays)} tone="text-emerald-400" />
            <Stat label="Poor days" value={String(rolling.poorDays)} tone="text-rose-400" />
          </div>
        </section>
      )}

      <div className="mt-5 space-y-3">
        {days.map((d) => {
          const v = VERDICT[d.verdict] || VERDICT.NO_TRADE_DAY;
          return (
            <section
              key={`${d.tradingDate}-${d.mode}`}
              className="rounded-xl border border-slate-800 bg-slate-900/30 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-slate-200">{d.tradingDate}</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                    {d.mode}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${v.ring} ${v.text}`}>
                    {d.verdict.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-sm tabular-nums text-slate-400">
                  <span className="text-slate-200">{d.targetsHit}</span>/{d.picksPublished} hit target
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">{d.diagnosis}</p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
                <Chip label="Triggered" value={`${d.triggered}/${d.picksPublished}`} />
                <Chip label="Stopped" value={String(d.stoppedOut)} />
                <Chip
                  label="Avg move"
                  value={`${d.avgMovePercent > 0 ? '+' : ''}${d.avgMovePercent}%`}
                  tone={d.avgMovePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                />
                {d.bestSymbol && (
                  <Chip
                    label="Best"
                    value={`${d.bestSymbol} ${d.bestMovePercent > 0 ? '+' : ''}${d.bestMovePercent}%`}
                    tone="text-emerald-400"
                  />
                )}
                {d.worstSymbol && (
                  <Chip
                    label="Worst"
                    value={`${d.worstSymbol} ${d.worstMovePercent}%`}
                    tone="text-rose-400"
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>

      {days.length === 0 && !error && (
        <p className="mt-8 text-sm text-slate-500">
          No graded days yet. Baskets are checked automatically after the close.
        </p>
      )}
    </main>
  );
}

const Stat = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <div className="bg-slate-900/60 px-5 py-3">
    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-1 text-lg font-semibold tabular-nums ${tone || 'text-slate-100'}`}>{value}</div>
  </div>
);

const Chip = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <span className="text-slate-500">
    {label} <span className={`ml-0.5 font-medium tabular-nums ${tone || 'text-slate-300'}`}>{value}</span>
  </span>
);
