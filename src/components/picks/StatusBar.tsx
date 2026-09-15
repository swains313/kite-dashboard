'use client';

import React from 'react';
import { KiteStatus } from '@/types/picks.types';

/**
 * The only thing that needs attention each morning is the Kite token, so that
 * is the one element here that ever becomes actionable.
 */
export function StatusBar({
  kite,
  tradingDate,
  phase,
}: {
  kite: KiteStatus;
  tradingDate: string;
  phase: string;
}) {
  const connected = kite.authenticated;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-2.5">
      <div className="flex items-center gap-2.5 text-sm">
        <span
          className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-600'}`}
        />
        <span className="text-slate-300">{tradingDate}</span>
        <span className="text-slate-700">/</span>
        <span className="text-slate-500">{phase}</span>
      </div>

      <div className="text-xs">
        {!kite.configured ? (
          <span className="text-slate-500">Kite keys not configured</span>
        ) : connected ? (
          <span className="text-emerald-400">Kite connected</span>
        ) : (
          <a
            href={kite.loginUrl || '#'}
            className="rounded-md bg-slate-800 px-2.5 py-1 font-medium text-slate-200 transition hover:bg-slate-700"
          >
            Connect Zerodha
          </a>
        )}
      </div>
    </div>
  );
}
