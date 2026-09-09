'use client';

import React from 'react';
import { CandidateStock } from '@/types/ai.types';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

interface TopCandidatesStripProps {
  currentSymbol: string;
  candidates?: CandidateStock[];
  onSelectStock: (symbol: string) => void;
  isLoading: boolean;
}

export const TopCandidatesStrip: React.FC<TopCandidatesStripProps> = ({
  currentSymbol,
  candidates,
  onSelectStock,
  isLoading,
}) => {
  if (!candidates || candidates.length <= 1) return null;

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">
          AI Top Setups Ranked:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {candidates.map((cand, idx) => {
          const isActive = cand.symbol.toUpperCase() === currentSymbol.toUpperCase();
          return (
            <button
              key={cand.symbol}
              type="button"
              disabled={isLoading || isActive}
              onClick={() => onSelectStock(cand.symbol)}
              title={cand.reason}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'bg-[#0b0e14] border border-[#232936] text-slate-300 hover:border-blue-500/50 hover:text-white'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-extrabold ${
                  isActive ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-400'
                }`}
              >
                #{idx + 1}
              </span>
              <span className="font-bold">{cand.symbol}</span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />+{cand.targetPercent}%
              </span>
              {!isActive && <ArrowRight className="w-3 h-3 text-slate-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
