'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';
import { DailyPick, TodayResponse, TradeMode } from '@/types/picks.types';
import { PickCard } from '@/components/picks/PickCard';
import { StatusBar } from '@/components/picks/StatusBar';
import { PerformancePanel } from '@/components/picks/PerformancePanel';
import { MarketContextCard } from '@/components/picks/MarketContextCard';

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
    <main className="mx-auto max-w-5xl px-5 py-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Today&apos;s Pick</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            One swing and one intraday candidate per trading day. Paper only.
          </p>
        </div>
        <Link
          href="/history"
          className="rounded-md border border-slate-800 px-3 py-1.5 text-sm text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
        >
          History
        </Link>
      </header>

      {data && (
        <div className="mt-5">
          <StatusBar kite={data.kite} tradingDate={data.tradingDate} phase={data.phase} />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          {data?.context && <MarketContextCard context={data.context} />}
          {MODES.map((mode) => {
            const pick = pickFor(mode);
            if (pick) return <PickCard key={mode} pick={pick} />;

            return (
              <section
                key={mode}
                className="rounded-xl border border-dashed border-slate-800 bg-slate-900/20 p-6 text-center"
              >
                <p className="text-sm text-slate-400">No {mode.toLowerCase()} pick yet today.</p>
                <p className="mt-1 text-xs text-slate-600">{SCHEDULE[mode]}</p>
                <button
                  onClick={() => void runScan(mode)}
                  disabled={scanning !== null}
                  className="mt-3 rounded-md bg-slate-800 px-4 py-1.5 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
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
