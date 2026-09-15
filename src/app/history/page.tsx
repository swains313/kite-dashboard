'use client';

import React, { useEffect, useState } from 'react';
import { apiGet, formatINR } from '@/lib/api';
import { DailyPick } from '@/types/picks.types';

const OUTCOME: Record<string, string> = {
  TARGET_1_HIT: 'text-emerald-400',
  TARGET_2_HIT: 'text-emerald-400',
  STOP_LOSS_HIT: 'text-rose-400',
  SQUARED_OFF: 'text-slate-400',
  TIME_EXIT: 'text-slate-400',
  NOT_TRIGGERED: 'text-slate-600',
  PENDING: 'text-amber-400',
};

/** Every pick ever published, with how it actually resolved. */
export default function History() {
  const [picks, setPicks] = useState<DailyPick[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: DailyPick[] }>('/api/picks/history?limit=120')
      .then((r) => setPicks(r.data))
      .catch((e) => setError((e as Error).message));
  }, []);

  const settled = picks.filter((p) => p.realizedPnL != null);
  const net = settled.reduce((a, p) => a + (p.realizedPnL || 0), 0);
  const wins = settled.filter((p) => (p.realizedPnL || 0) > 0).length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">History</h1>
          <p className="mt-1 text-sm text-slate-500">
            {picks.length} published · {settled.length} settled
            {settled.length > 0 && (
              <>
                {' '}
                · {wins}W / {settled.length - wins}L ·{' '}
                <span className={net >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatINR(net)}
                </span>
              </>
            )}
          </p>
        </div>
      </header>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Symbol</th>
              <th className="px-4 py-3 text-right font-semibold">Score</th>
              <th className="px-4 py-3 text-right font-semibold">Entry</th>
              <th className="px-4 py-3 text-right font-semibold">Stop</th>
              <th className="px-4 py-3 text-left font-semibold">Outcome</th>
              <th className="px-4 py-3 text-right font-semibold">Net P&L</th>
              <th className="px-4 py-3 text-right font-semibold">R</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {picks.map((p) => (
              <tr key={p._id} className="transition hover:bg-slate-900/40">
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{p.tradingDate}</td>
                <td className="px-4 py-2.5">
                  <span className="font-medium text-slate-100">{p.symbol}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-600">
                    {p.mode}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-400">
                  {p.convictionScore}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-300">
                  {formatINR(p.entryTrigger)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">
                  {formatINR(p.stopLoss)}
                </td>
                <td className={`px-4 py-2.5 text-xs ${OUTCOME[p.outcome] || 'text-slate-400'}`}>
                  {p.outcome.replace(/_/g, ' ').toLowerCase()}
                </td>
                <td
                  className={`px-4 py-2.5 text-right font-medium tabular-nums ${
                    p.realizedPnL == null
                      ? 'text-slate-600'
                      : p.realizedPnL >= 0
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                  }`}
                >
                  {p.realizedPnL != null ? formatINR(p.realizedPnL) : '—'}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-500">
                  {p.realizedRMultiple != null ? `${p.realizedRMultiple}R` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {picks.length === 0 && !error && (
        <p className="mt-6 text-sm text-slate-500">No picks recorded yet.</p>
      )}
    </main>
  );
}
