'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPost, formatINR } from '@/lib/api';
import {
  DailyPick,
  MarketContext,
  RollingDiagnosis,
  TodayResponse,
  TradeMode,
} from '@/types/picks.types';
import { PickDetail } from '@/components/picks/PickDetail';
import { MarketContextCard } from '@/components/picks/MarketContextCard';

const MODES: TradeMode[] = ['SWING', 'INTRADAY'];
const MAX_PRICE_KEY = 'kite.maxPrice';

/**
 * The daily screen, laid out to fit one viewport: a compact market strip, the
 * five ranked candidates as rows, and the selected pick's detail beside them.
 */
export default function Home() {
  const [data, setData] = useState<TodayResponse | null>(null);
  const [context, setContext] = useState<MarketContext | null>(null);
  const [rolling, setRolling] = useState<RollingDiagnosis | null>(null);
  const [mode, setMode] = useState<TradeMode>('SWING');
  const [selected, setSelected] = useState<string | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [maxPrice, setMaxPrice] = useState('5000');
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // Remembered per browser; the scan itself is driven by the value sent with it.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MAX_PRICE_KEY);
      if (saved) setMaxPrice(saved);
    } catch {
      // Private mode or blocked storage — the default stands.
    }
  }, []);

  const load = useCallback(async () => {
    try {
      const today = await apiGet<TodayResponse>('/api/picks/today');
      setData(today);
      setError(null);

      if (today.context) setContext(today.context);
      else {
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
    const timer = setInterval(() => void load(), 30_000);
    return () => clearInterval(timer);
  }, [load]);

  const runScan = async () => {
    setScanning(true);
    setError(null);
    try {
      const cap = Number(maxPrice);
      try {
        localStorage.setItem(MAX_PRICE_KEY, maxPrice);
      } catch {
        // Ignore storage failures.
      }
      await apiPost('/api/picks/run', {
        mode,
        force: true,
        maxPrice: Number.isFinite(cap) && cap > 0 ? cap : undefined,
      });
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setScanning(false);
    }
  };

  const basket: DailyPick[] = (data?.picks || [])
    .filter((p) => p.mode === mode)
    .sort((a, b) => (a.rank || 1) - (b.rank || 1));

  const active = basket.find((p) => p._id === selected) || basket[0] || null;

  return (
    <main className="mx-auto max-w-6xl px-5 py-5">
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">Today&apos;s Picks</h1>
          {data && (
            <span className="text-xs text-slate-500">
              {data.tradingDate} · {data.phase}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            Max price ₹
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric"
              className="w-20 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs tabular-nums text-slate-100 focus:border-slate-600 focus:outline-none"
            />
          </label>
          <button
            onClick={() => void runScan()}
            disabled={scanning}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-slate-700 disabled:opacity-50"
          >
            {scanning ? 'Scanning…' : 'Rescan'}
          </button>
          {data && !data.kite.authenticated && data.kite.configured && (
            <a
              href={data.kite.loginUrl || '#'}
              className="rounded-md bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300 ring-1 ring-amber-500/25 transition hover:bg-amber-500/20"
            >
              Connect Zerodha →
            </a>
          )}
        </div>
      </div>

      {/* Market strip — collapsed by default so the picks stay above the fold. */}
      {context && (
        <div className="mt-3">
          <button
            onClick={() => setShowContext((v) => !v)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2 text-left transition hover:border-slate-700"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  context.bias === 'RISK_ON'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : context.bias === 'RISK_OFF'
                      ? 'bg-rose-500/15 text-rose-400'
                      : 'bg-slate-700/40 text-slate-400'
                }`}
              >
                {context.bias.replace('_', '-')} {context.biasScore}
              </span>
              <span className="truncate text-xs text-slate-500">
                {context.globalCues
                  .slice(0, 4)
                  .map((c) => `${c.label} ${c.changePercent > 0 ? '+' : ''}${c.changePercent}%`)
                  .join('  ·  ')}
              </span>
            </div>
            <span className="shrink-0 text-xs text-slate-600">{showContext ? 'hide' : 'details'}</span>
          </button>
          {showContext && (
            <div className="mt-2">
              <MarketContextCard context={context} />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
          {error}
        </p>
      )}

      {/* Mode tabs */}
      <div className="mt-3 flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/40 p-1">
        {MODES.map((m) => {
          const count = (data?.picks || []).filter((p) => p.mode === m).length;
          return (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setSelected(null);
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm transition ${
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

      {/* Picks + detail, side by side */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border border-slate-800">
          {basket.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-400">No {mode.toLowerCase()} picks yet today.</p>
              <button
                onClick={() => void runScan()}
                disabled={scanning}
                className="mt-3 rounded-md bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
              >
                {scanning ? 'Scanning 190 stocks…' : 'Run scan now'}
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 text-left font-semibold">#</th>
                  <th className="px-3 py-2 text-left font-semibold">Stock</th>
                  <th className="px-3 py-2 text-right font-semibold">Buy above</th>
                  <th className="px-3 py-2 text-right font-semibold">Stop</th>
                  <th className="px-3 py-2 text-right font-semibold">Target</th>
                  <th className="px-3 py-2 text-right font-semibold">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {basket.map((p) => {
                  const on = active?._id === p._id;
                  return (
                    <tr
                      key={p._id}
                      onClick={() => setSelected(p._id)}
                      className={`cursor-pointer transition ${
                        on ? 'bg-slate-800/60' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="px-3 py-2.5 text-slate-600">{p.rank}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-slate-100">{p.symbol}</div>
                        <div
                          className={`text-[10px] ${
                            p.grade === 'A_GRADE'
                              ? 'text-emerald-400'
                              : p.grade === 'B_GRADE'
                                ? 'text-amber-400'
                                : 'text-slate-600'
                          }`}
                        >
                          {p.grade === 'A_GRADE'
                            ? 'tradeable'
                            : p.grade === 'B_GRADE'
                              ? 'marginal'
                              : 'no setup'}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-200">
                        {formatINR(p.entryTrigger)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-rose-400">
                        {formatINR(p.stopLoss)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-emerald-400">
                        +{p.target1Percent}%
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-400">
                        {p.suggestedQuantity}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-300">
                        {p.convictionScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Compact footer stats, so the sidebar does not need to carry them. */}
          {data && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-slate-800 bg-slate-950/40 px-3 py-2 text-[11px] text-slate-500">
              <span>
                Open positions{' '}
                <span className="text-slate-300">{data.openPositions.length}</span>
              </span>
              {rolling && rolling.daysAssessed > 0 && (
                <>
                  <span>
                    Target rate <span className="text-slate-300">{rolling.avgHitRate}%</span>
                  </span>
                  <span>
                    Avg move{' '}
                    <span
                      className={rolling.avgMovePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                    >
                      {rolling.avgMovePercent > 0 ? '+' : ''}
                      {rolling.avgMovePercent}%
                    </span>
                  </span>
                </>
              )}
              <span className="text-slate-600">data {basket[0]?.dataSource || '—'}</span>
            </div>
          )}
        </div>

        {active ? (
          <PickDetail pick={active} />
        ) : (
          <div className="grid place-items-center rounded-xl border border-dashed border-slate-800 p-6 text-center text-sm text-slate-600">
            Select a pick to see its levels and signals.
          </div>
        )}
      </div>

      {rolling && rolling.daysAssessed > 0 && (
        <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-2.5 text-xs leading-relaxed text-slate-400">
          <span className="font-medium text-slate-300">Is the analysis right?</span> {rolling.reading}
        </p>
      )}
    </main>
  );
}
