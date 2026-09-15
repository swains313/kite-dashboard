'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';
import { DailyPick, TodayResponse, TradeMode } from '@/types/picks.types';
import { PickCard } from '@/components/picks/PickCard';
import { StatusBar } from '@/components/picks/StatusBar';
import { PerformancePanel } from '@/components/picks/PerformancePanel';

const MODES: TradeMode[] = ['SWING', 'INTRADAY'];
const SCHEDULE: Record<TradeMode, string> = {
  SWING: 'Scheduled 08:45 IST',
  INTRADAY: 'Scheduled 09:30 IST',
};

/**
 * The daily screen: what to buy today, at what levels, and how the strategy has
 * performed so far. Everything else lives behind /history.
 */
export default function Home() {
  const [data, setData] = useState<TodayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<TradeMode | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await apiGet<TodayResponse>('/api/picks/today'));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    void load();
    // The scheduler drives everything server-side; the UI just re-reads.
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
    <main className="mx-auto max-w-4xl px-5 py-10">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-base font-medium text-slate-100">Today&apos;s Pick</h1>
        <Link href="/history" className="text-sm text-slate-500 hover:text-slate-300">
          History
        </Link>
      </header>

      {data && (
        <div className="mt-4">
          <StatusBar kite={data.kite} tradingDate={data.tradingDate} phase={data.phase} />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_200px]">
        <div className="space-y-4">
          {MODES.map((mode) => {
            const pick = pickFor(mode);
            if (pick) return <PickCard key={mode} pick={pick} />;

            return (
              <section key={mode} className="rounded-lg border border-slate-800/60 p-5 text-sm">
                <p className="text-slate-400">No {mode.toLowerCase()} pick yet today.</p>
                <p className="mt-1 text-xs text-slate-600">{SCHEDULE[mode]}</p>
                <button
                  onClick={() => void runScan(mode)}
                  disabled={scanning !== null}
                  className="mt-3 text-sm text-slate-300 underline underline-offset-4 hover:text-slate-100 disabled:text-slate-600 disabled:no-underline"
                >
                  {scanning === mode ? 'Scanning…' : 'Run scan now'}
                </button>
              </section>
            );
          })}
        </div>

        {data && <PerformancePanel performance={data.performance} positions={data.openPositions} />}
      </div>

      {!data && !error && <p className="mt-6 text-sm text-slate-500">Loading…</p>}
    </main>
  );
}
