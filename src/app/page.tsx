'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';
import { DailyPick, MarketContext, TodayResponse, TradeMode } from '@/types/picks.types';
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
 * The daily screen: the market read, what to buy, at what levels, and how the
 * strategy has performed. Everything else lives behind /history.
 */
export default function Home() {
  const [data, setData] = useState<TodayResponse | null>(null);
  const [context, setContext] = useState<MarketContext | null>(null);
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

  const runScan = async (mode: TradeMode) => {
    setScanning(mode);
    setError(null);
    try {
      await apiPost('/api/picks/run', { mode, force: true });
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setScanning(null);
    }
  };

  const pickFor = (mode: TradeMode): DailyPick | undefined =>
    data?.picks.find((p) => p.mode === mode);

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">Today&apos;s Pick</h1>
          <p className="mt-1 text-sm text-slate-500">
            One swing and one intraday candidate per trading day · paper only, no live orders
          </p>
        </div>
        <Link
          href="/history"
          className="rounded-md border border-slate-800 px-3 py-1.5 text-sm text-slate-400 transition hover:border-slate-700 hover:bg-slate-900 hover:text-slate-200"
        >
          History
        </Link>
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

          {MODES.map((mode) => {
            const pick = pickFor(mode);
            if (pick) return <PickCard key={mode} pick={pick} />;

            return (
              <section
                key={mode}
                className="rounded-xl border border-dashed border-slate-800 bg-slate-900/20 px-6 py-8 text-center"
              >
                <p className="text-sm font-medium text-slate-300">
                  No {mode.toLowerCase()} pick yet today
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
            );
          })}
        </div>

        {data && <PerformancePanel performance={data.performance} positions={data.openPositions} />}
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
