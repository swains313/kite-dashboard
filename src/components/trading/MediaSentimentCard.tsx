'use client';

import React from 'react';
import { MediaSentiment, MultiLayerConfluence } from '@/types/ai.types';
import { Newspaper, Layers, TrendingUp, TrendingDown, Clock, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface MediaSentimentCardProps {
  mediaSentiment?: MediaSentiment;
  multiLayerConfluence?: MultiLayerConfluence;
  symbol: string;
}

export const MediaSentimentCard: React.FC<MediaSentimentCardProps> = ({
  mediaSentiment,
  multiLayerConfluence,
  symbol,
}) => {
  if (!mediaSentiment && !multiLayerConfluence) return null;

  const score = mediaSentiment?.sentimentScore || 0;
  const label = mediaSentiment?.sentimentLabel || 'NEUTRAL';

  const getScoreColor = (s: number) => {
    if (s >= 20) return 'text-emerald-400';
    if (s <= -20) return 'text-rose-400';
    return 'text-amber-400';
  };

  const getBadgeStyle = (sent: string) => {
    switch (sent) {
      case 'BULLISH':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'BEARISH':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/15 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Multi-Layer Confluence & Media Intelligence ({symbol})
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Synthesizing Technical Microstructure + Historical Trend + Live Financial Media
            </span>
          </div>
        </div>

        {mediaSentiment && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Media Sentiment:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 ${getBadgeStyle(
                label
              )}`}
            >
              {label === 'BULLISH' ? (
                <TrendingUp className="w-3 h-3" />
              ) : label === 'BEARISH' ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              {label} ({score > 0 ? `+${score}%` : `${score}%`})
            </span>
          </div>
        )}
      </div>

      {/* Multi-Layer Confluence Matrix */}
      {multiLayerConfluence && (
        <div className="space-y-2.5">
          <div className="bg-[#0b0e14] border border-blue-900/30 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Composite Verdict:
              </span>
            </div>
            <span className="text-xs font-mono font-extrabold text-blue-300 px-3 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30">
              {multiLayerConfluence.compositeVerdict}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono">
            {/* Layer 1: Technical */}
            <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Layer 1: Price Action & VWAP
              </span>
              <p className="text-[11px] text-slate-200 leading-snug">
                {multiLayerConfluence.technicalLayer}
              </p>
            </div>

            {/* Layer 2: Historical */}
            <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Layer 2: Historical 30D Trend
              </span>
              <p className="text-[11px] text-slate-200 leading-snug">
                {multiLayerConfluence.historicalLayer}
              </p>
            </div>

            {/* Layer 3: News Media */}
            <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Layer 3: Media Sentiment
              </span>
              <p className="text-[11px] text-slate-200 leading-snug">
                {multiLayerConfluence.newsMediaLayer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live News Headlines & Catalysts */}
      {mediaSentiment && mediaSentiment.news && mediaSentiment.news.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-[#232936]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono">
              <Newspaper className="w-3.5 h-3.5 text-indigo-400" />
              Live Financial News & Catalysts ({mediaSentiment.catalystType})
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {mediaSentiment.summary}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {mediaSentiment.news.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0b0e14] border border-[#232936] hover:border-slate-700 p-3 rounded-xl flex flex-col justify-between space-y-2 transition-colors"
              >
                <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-snug">
                  {item.title}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1e2533]">
                  <span className="flex items-center gap-1 text-slate-300 font-semibold">
                    {item.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" /> {item.publishedTime}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] border ${getBadgeStyle(
                        item.sentiment
                      )}`}
                    >
                      {item.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
