'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPost, formatINR } from '@/lib/api';
import { CandleChart, PriceLevel } from '@/components/charts/CandleChart';
import { ChartData, HoldAdvice, TodayResponse } from '@/types/picks.types';

const VERDICT: Record<string, { text: string; ring: string; label: string }> = {
  ADD: { text: 'text-emerald-400', ring: 'bg-emerald-500/10 ring-emerald-500/25', label: 'Hold & add' },
  HOLD: { text: 'text-emerald-400', ring: 'bg-emerald-500/10 ring-emerald-500/25', label: 'Hold' },
  TRIM: { text: 'text-amber-400', ring: 'bg-amber-500/10 ring-amber-500/25', label: 'Trim' },
  EXIT: { text: 'text-rose-400', ring: 'bg-rose-500/10 ring-rose-500/25', label: 'Exit' },
};

/**
 * Chart + position advisor. The question this page answers is "I own this —
 * hold or sell?", which is distinct from whether it is a good new buy.
 */
export default function Charts() {
  const [symbol, setSymbol] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [chart, setChart] = useState<ChartData | null>(null);
  const [advice, setAdvice] = useState<HoldAdvice | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Seed the quick-pick row from today's basket.
  useEffect(() => {
    apiGet<TodayResponse>('/api/picks/today')
      .then((r) => setSuggestions([...new Set(r.picks.map((p) => p.symbol))].slice(0, 6)))
      .catch(() => undefined);
  }, []);

  const analyse = useCallback(async (sym: string, entry?: string) => {
    if (!sym.trim()) return;
    setLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const body: { symbol: string; entryPrice?: number } = { symbol: sym.trim().toUpperCase() };
      const parsed = entry ? Number(entry) : NaN;
      if (!Number.isNaN(parsed) && parsed > 0) body.entryPrice = parsed;

      const res = await apiPost<{ data: HoldAdvice }>('/api/advisor/hold-or-sell', body);
      setAdvice(res.data);
      setChart(res.data.chart);
    } catch (err) {
      setError((err as Error).message);
      // Still try to draw the chart, so a failed verdict does not blank the page.
      try {
        const c = await apiGet<{ data: ChartData }>(`/api/chart/${sym.trim().toUpperCase()}`);
        setChart(c.data);
      } catch {
        setChart(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const levels: PriceLevel[] = advice
    ? [
        { price: advice.suggestedStop, label: 'Stop', tone: 'stop' },
        ...(advice.entryPrice !== advice.currentPrice
          ? [{ price: advice.entryPrice, label: 'Your entry', tone: 'entry' as const }]
          : []),
      ]
    : [];

  const v = advice ? VERDICT[advice.verdict] : null;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">Charts &amp; Advisor</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter a stock you own. Add your buy price for a concrete hold, trim or exit call.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void analyse(symbol, entryPrice);
        }}
        className="mt-5 flex flex-wrap gap-2"
      >
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol, e.g. RELIANCE"
          className="min-w-[200px] flex-1 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-slate-600 focus:outline-none"
        />
        <input
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          placeholder="Your buy price (optional)"
          inputMode="decimal"
          className="w-52 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-slate-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !symbol.trim()}
          className="rounded-md bg-slate-800 px-5 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? 'Analysing…' : 'Analyse'}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-600">Today&apos;s picks:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSymbol(s);
                void analyse(s, entryPrice);
              }}
              className="rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {error}
        </p>
      )}

      {advice && v && (
        <section className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-semibold text-slate-50">{advice.symbol}</h2>
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${v.ring} ${v.text}`}>
                  {v.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {formatINR(advice.currentPrice)}
                {advice.entryPrice !== advice.currentPrice && (
                  <>
                    {' · '}
                    <span className={advice.unrealizedPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {advice.unrealizedPercent > 0 ? '+' : ''}
                      {advice.unrealizedPercent}% from {formatINR(advice.entryPrice)}
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Suggested stop</div>
              <div className="text-lg font-semibold tabular-nums text-rose-400">
                {formatINR(advice.suggestedStop)}
              </div>
              <div className="text-[11px] text-slate-600">{advice.confidence}% confidence</div>
            </div>
          </div>

          <p className="px-5 py-4 text-sm leading-relaxed text-slate-300">{advice.summary}</p>

          {(advice.reasons.length > 0 || advice.warnings.length > 0) && (
            <div className="grid gap-px border-t border-slate-800 bg-slate-800 sm:grid-cols-2">
              <Column title="Supports holding" items={advice.reasons} tone="text-emerald-400" empty="Nothing currently supports this position." />
              <Column title="Against holding" items={advice.warnings} tone="text-rose-400" empty="No warnings." />
            </div>
          )}
        </section>
      )}

      {chart && (
        <section className="mt-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-5 py-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {chart.symbol} · daily
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="tabular-nums text-slate-300">{formatINR(chart.lastPrice)}</span>
              <span className={chart.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {chart.changePercent > 0 ? '+' : ''}
                {chart.changePercent}%
              </span>
              <span className="text-slate-600">{chart.source}</span>
            </div>
          </div>
          <div className="px-3 py-3">
            <CandleChart chart={chart} levels={levels} />
          </div>
        </section>
      )}

      {!chart && !loading && !error && (
        <p className="mt-8 text-sm text-slate-500">
          Enter a symbol above to see its chart and a hold-or-sell reading.
        </p>
      )}
    </main>
  );
}

const Column = ({
  title,
  items,
  tone,
  empty,
}: {
  title: string;
  items: string[];
  tone: string;
  empty: string;
}) => (
  <div className="bg-slate-900/60 px-5 py-4">
    <h3 className={`text-[10px] font-semibold uppercase tracking-wider ${tone}`}>{title}</h3>
    {items.length === 0 ? (
      <p className="mt-2 text-xs text-slate-600">{empty}</p>
    ) : (
      <ul className="mt-2 space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="text-xs leading-relaxed text-slate-400">
            {t}
          </li>
        ))}
      </ul>
    )}
  </div>
);
