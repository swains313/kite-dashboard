'use client';

import React from 'react';
import { MarketContext } from '@/types/picks.types';

const BIAS_STYLE: Record<string, string> = {
  RISK_ON: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  NEUTRAL: 'bg-slate-500/10 text-slate-400 ring-slate-500/20',
  RISK_OFF: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
};

/**
 * Pre-open market read: global cues, index regime and media sentiment.
 * Shown above the picks because it decides whether to act on them at all.
 */
export function MarketContextCard({ context }: { context: MarketContext }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Market context
        </h2>
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ring-1 ${
            BIAS_STYLE[context.bias] || BIAS_STYLE.NEUTRAL
          }`}
        >
          {context.bias.replace('_', '-')} · {context.biasScore > 0 ? '+' : ''}
          {context.biasScore}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">{context.summary}</p>

      {context.globalCues.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800 pt-3">
          {context.globalCues.map((cue) => (
            <div key={cue.label} className="text-xs">
              <div className="text-slate-500">{cue.label}</div>
              <div
                className={`tabular-nums ${
                  cue.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {cue.changePercent > 0 ? '+' : ''}
                {cue.changePercent}%
              </div>
            </div>
          ))}
        </div>
      )}

      {context.news.headlines.length > 0 && (
        <div className="mt-4 border-t border-slate-800 pt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Media</span>
            <span className="text-slate-600">·</span>
            <span>{context.news.label.toLowerCase()}</span>
            {context.news.hasCatalyst && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{context.news.catalystType}</span>
              </>
            )}
          </div>
          <ul className="mt-2 space-y-1.5">
            {context.news.headlines.slice(0, 3).map((h, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed">
                <span
                  className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                    h.sentiment === 'BULLISH'
                      ? 'bg-emerald-400'
                      : h.sentiment === 'BEARISH'
                        ? 'bg-rose-400'
                        : 'bg-slate-600'
                  }`}
                />
                <span className="text-slate-400">{h.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!context.tradingAdvised && (
        <p className="mt-4 rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-300 ring-1 ring-amber-500/20">
          Picks are still published today, but not simulated as trades — the index regime argues
          against new long risk.
        </p>
      )}
    </section>
  );
}
