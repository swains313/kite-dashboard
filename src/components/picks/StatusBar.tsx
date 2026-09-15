'use client';

import React from 'react';
import { KiteStatus } from '@/types/picks.types';

/**
 * Session strip. The Kite token is the one thing that needs attention each
 * morning, so it is the only element here that ever becomes actionable.
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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2.5">
      <div className="flex items-center gap-2.5 text-sm">
        <span className="relative flex h-2 w-2">
          {connected && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          )}
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              connected ? 'bg-emerald-400' : 'bg-slate-600'
            }`}
          />
        </span>
        <span className="font-medium text-slate-300">{tradingDate}</span>
        <span className="text-slate-700">/</span>
        <span className="text-slate-500">{phase}</span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        {kite.configured && !kite.historicalEnabled && (
          <span className="hidden text-slate-600 sm:inline">daily data via Yahoo</span>
        )}
        {!kite.configured ? (
          <span className="text-slate-500">Kite keys not configured</span>
        ) : connected ? (
          <span className="font-medium text-emerald-400">Kite connected</span>
        ) : (
          <a
            href={kite.loginUrl || '#'}
            className="rounded-md bg-amber-500/10 px-2.5 py-1 font-medium text-amber-300 ring-1 ring-amber-500/25 transition hover:bg-amber-500/20"
          >
            Connect Zerodha →
          </a>
        )}
      </div>
    </div>
  );
}
