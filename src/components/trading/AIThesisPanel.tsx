'use client';

import React from 'react';
import { Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const AIThesisPanel: React.FC = () => {
  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Multi-AI Setup Thesis</h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Setup Approved
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" /> XGBoost Probability
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">84.2%</div>
        </div>

        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Gemini 2.5 Thesis
          </div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">BULLISH BREAKOUT</div>
        </div>
      </div>

      <div className="p-3 bg-[#0b0e14] border border-[#232936] rounded-xl text-xs text-slate-300 leading-relaxed space-y-1">
        <div className="font-semibold text-slate-200">AI Reasoning:</div>
        <p className="text-[11px] text-slate-400">
          Price closed above 20 EMA and VWAP on 1M and 5M timeframe with volume surge (+42%).
          Risk engine cleared position sizing within 1% cap. Idempotency cleared.
        </p>
      </div>
    </div>
  );
};
