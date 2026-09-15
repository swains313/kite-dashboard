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
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-y border-slate-800 py-2.5 text-xs text-slate-500">
      <span>
        {tradingDate} · {phase}
      </span>

      {!kite.configured ? (
        <span>Kite keys not configured</span>
      ) : kite.authenticated ? (
        <span>Kite connected</span>
      ) : (
        <a href={kite.loginUrl || '#'} className="text-slate-300 underline underline-offset-4 hover:text-slate-100">
          Connect Zerodha
        </a>
      )}
    </div>
  );
}
