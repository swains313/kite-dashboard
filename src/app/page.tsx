'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import {
  DailyPick,
  MarketContext,
  RollingDiagnosis,
  TodayResponse,
  TradeMode,
} from '@/types/picks.types';
import { PickCard } from '@/components/picks/PickCard';
import { StatusBar } from '@/components/picks/StatusBar';
import { PerformancePanel } from '@/components/picks/PerformancePanel';
import { MarketContextCard } from '@/components/picks/MarketContextCard';

const MODES: TradeMode[] = ['SWING', 'INTRADAY'];
const SCHEDULE: Record<TradeMode, string> = {
  SWING: 'Published pre-open, 08:45 IST',
  INTRADAY: 'Published after the opening range, 09:30 IST',
};

/**
 * The daily screen: the market read, the day's five candidates per mode, and
 * how the strategy has performed.
 */
export default function Home() {
  const [data, setData] = useState<TodayResponse | null>(null);
  const [context, setContext] = useState<MarketContext | null>(null);
  const [rolling, setRolling] = useState<RollingDiagnosis | null>(null);
  const [mode, setMode] = useState<TradeMode>('SWING');
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<TradeMode | null>(null);

  const load = useCallback(async () => {
    try {
      const today = await apiGet<TodayResponse>('/api/picks/today');
      setData(today);
      setError(null);

      // The loop only builds context during the session; fetch it directly so
      // the market read is visible outside trading hours too.
      if (today.context) {
        setContext(today.context);
      } else {
        const res = await apiGet<{ data: MarketContext }>('/api/market/context').catch(() => null);
        if (res?.data) setContext(res.data);
      }

      const acc = await apiGet<{ rolling: RollingDiagnosis }>('/api/accuracy').catch(() => null);
      if (acc?.rolling) setRolling(acc.rolling);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    void load();
    // The event loop drives everything server-side; the UI just re-reads.
    const timer = setInterval(() => void load(), 30_000);
    return () => clearInterval(timer);
  }, [load]);

  const runScan = async (m: TradeMode) => {
    setScanning(m);
    setError(null);
    try {
      await apiPost('/api/picks/run', { mode: m, force: true });
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setScanning(null);
    }
  };

  const basket: DailyPick[] = (data?.picks || [])
    .filter((p) => p.mode === mode)
    .sort((a, b) => (a.rank || 1) - (b.rank || 1));

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">Today&apos;s Picks</h1>
        <p className="mt-1 text-sm text-slate-500">
          Five ranked candidates per mode, graded against the close · paper only, no live orders
        </p>
      </header>

      {data && (
        <div className="mt-5">
          <StatusBar kite={data.kite} tradingDate={data.tradingDate} phase={data.phase} />
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          {context && <MarketContextCard context={context} />}

          {/* Mode tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/40 p-1">
            {MODES.map((m) => {
              const count = (data?.picks || []).filter((p) => p.mode === m).length;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm transition ${
                    mode === m
                      ? 'bg-slate-800 font-medium text-slate-100'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m === 'SWING' ? 'Swing' : 'Intraday'}
                  {count > 0 && <span className="ml-1.5 text-xs text-slate-600">{count}</span>}
                </button>
              );
            })}
          </div>

          {basket.length > 0 ? (
            basket.map((pick) => <PickCard key={pick._id} pick={pick} />)
          ) : (
            <section className="rounded-xl border border-dashed border-slate-800 bg-slate-900/20 px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">
                No {mode.toLowerCase()} picks yet today
              </p>
              <p className="mt-1 text-xs text-slate-600">{SCHEDULE[mode]}</p>
              <button
                onClick={() => void runScan(mode)}
                disabled={scanning !== null}
                className="mt-4 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {scanning === mode ? 'Scanning 190 stocks…' : 'Run scan now'}
              </button>
            </section>
          )}
        </div>

        <div className="space-y-4">
          {rolling && rolling.daysAssessed > 0 && (
            <section className="overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
              <div className="border-b border-slate-800 px-4 py-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Is the analysis right?
                </h2>
              </div>
              <p className="px-4 py-3 text-xs leading-relaxed text-slate-400">{rolling.reading}</p>
              <div className="grid grid-cols-2 gap-px border-t border-slate-800 bg-slate-800">
                <MiniStat label="Target rate" value={`${rolling.avgHitRate}%`} />
                <MiniStat
                  label="Avg move"
                  value={`${rolling.avgMovePercent > 0 ? '+' : ''}${rolling.avgMovePercent}%`}
                  tone={rolling.avgMovePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                />
              </div>
            </section>
          )}

          {data && (
            <PerformancePanel performance={data.performance} positions={data.openPositions} />
          )}
        </div>
      </div>

      {!data && !error && (
        <div className="mt-8 space-y-4">
          <div className="h-32 animate-pulse rounded-xl border border-slate-800 bg-slate-900/30" />
          <div className="h-64 animate-pulse rounded-xl border border-slate-800 bg-slate-900/30" />
        </div>
      )}
    </main>
  );
}

const MiniStat = ({ label, value, tone }: { label: string; value: string; tone?: string }) => (
  <div className="bg-slate-900/60 px-4 py-2.5">
    <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`mt-0.5 text-sm font-semibold tabular-nums ${tone || 'text-slate-200'}`}>
      {value}
    </div>
  </div>
);
