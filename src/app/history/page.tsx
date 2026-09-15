'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, formatINR } from '@/lib/api';
import { DailyPick } from '@/types/picks.types';

/** Every pick ever published, with how it actually resolved. */
export default function History() {
  const [picks, setPicks] = useState<DailyPick[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ data: DailyPick[] }>('/api/picks/history?limit=120')
      .then((r) => setPicks(r.data))
      .catch((e) => setError((e as Error).message));
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-base font-medium text-slate-100">History</h1>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-300">
          Today
        </Link>
      </header>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[540px] text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 text-left font-normal">Date</th>
              <th className="py-2 text-left font-normal">Symbol</th>
              <th className="py-2 text-right font-normal">Entry</th>
              <th className="py-2 text-left font-normal">Outcome</th>
              <th className="py-2 text-right font-normal">Net P&L</th>
            </tr>
          </thead>
          <tbody>
            {picks.map((p) => (
              <tr key={p._id} className="border-b border-slate-800/50">
                <td className="py-2.5 text-slate-500">{p.tradingDate}</td>
                <td className="py-2.5 text-slate-200">
                  {p.symbol}
                  <span className="ml-2 text-xs text-slate-600">{p.mode.toLowerCase()}</span>
                </td>
                <td className="py-2.5 text-right tabular-nums text-slate-400">
                  {formatINR(p.entryTrigger)}
                </td>
                <td className="py-2.5 text-xs text-slate-500">
                  {p.outcome.replace(/_/g, ' ').toLowerCase()}
                </td>
                <td
                  className={`py-2.5 text-right tabular-nums ${
                    p.realizedPnL == null
                      ? 'text-slate-600'
                      : p.realizedPnL >= 0
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                  }`}
                >
                  {p.realizedPnL != null ? formatINR(p.realizedPnL) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {picks.length === 0 && !error && <p className="mt-6 text-sm text-slate-500">No picks yet.</p>}
    </main>
  );
}
