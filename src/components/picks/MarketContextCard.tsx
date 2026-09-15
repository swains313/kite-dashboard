'use client';

import React from 'react';
import { MarketContext } from '@/types/picks.types';

const BIAS: Record<string, { text: string; bg: string; bar: string }> = {
  RISK_ON: { text: 'text-emerald-400', bg: 'bg-emerald-500/10 ring-emerald-500/25', bar: 'bg-emerald-500' },
  NEUTRAL: { text: 'text-slate-400', bg: 'bg-slate-500/10 ring-slate-500/25', bar: 'bg-slate-500' },
  RISK_OFF: { text: 'text-rose-400', bg: 'bg-rose-500/10 ring-rose-500/25', bar: 'bg-rose-500' },
};

/**
 * Pre-open market read: global cues, index regime and media sentiment.
 * Sits above the picks because it decides whether to act on them at all.
 */
export function MarketContextCard({ context }: { context: MarketContext }) {
  const b = BIAS[context.bias] || BIAS.NEUTRAL;
  // Map -100..+100 onto a 0..100 track so the marker reads as a dial.
  const dial = Math.round((context.biasScore + 100) / 2);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-900/20">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Market context
        </h2>
        <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ring-1 ${b.bg} ${b.text}`}>
          {context.bias.replace('_', '-')} {context.biasScore > 0 ? '+' : ''}
          {context.biasScore}
        </span>
      </div>

      {/* Bias dial */}
      <div className="px-5 pt-4">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-gradient-to-r from-rose-500/30 via-slate-700 to-emerald-500/30">
          <div
            className={`absolute top-0 h-full w-1 rounded-full ${b.bar}`}
            style={{ left: `calc(${dial}% - 2px)` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-slate-600">
          <span>risk-off</span>
          <span>risk-on</span>
        </div>
      </div>

      <p className="px-5 py-4 text-sm leading-relaxed text-slate-400">{context.summary}</p>

      {context.globalCues.length > 0 && (
        <div className="grid grid-cols-3 gap-px border-y border-slate-800 bg-slate-800 sm:grid-cols-4 lg:grid-cols-7">
          {context.globalCues.map((cue) => (
            <div key={cue.label} className="bg-slate-900/60 px-3 py-2.5">
              <div className="truncate text-[10px] uppercase tracking-wider text-slate-500">
                {cue.label}
              </div>
              <div
                className={`mt-0.5 text-sm font-semibold tabular-nums ${
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
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-semibold uppercase tracking-widest text-slate-500">Media</span>
            <span className={`font-medium ${
              context.news.label === 'BULLISH'
                ? 'text-emerald-400'
                : context.news.label === 'BEARISH'
                  ? 'text-rose-400'
                  : 'text-slate-400'
            }`}>
              {context.news.label.toLowerCase()} {context.news.score > 0 ? '+' : ''}
              {context.news.score}
            </span>
            {context.news.hasCatalyst && (
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
                {context.news.catalystType}
              </span>
            )}
            <span className="text-slate-600">{context.news.articleCount} headlines</span>
          </div>

          <ul className="mt-3 space-y-2">
            {context.news.headlines.slice(0, 3).map((h, i) => (
              <li key={i} className="flex gap-2.5 text-xs leading-relaxed">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
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
        <p className="border-t border-slate-800 bg-amber-500/[0.06] px-5 py-3 text-xs text-amber-300/90">
          Picks are still published today, but not simulated as trades — the index regime argues
          against new long risk.
        </p>
      )}
    </section>
  );
}
