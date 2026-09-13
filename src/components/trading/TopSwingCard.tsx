import React from 'react';
import { TopSwingCandidate } from '@/types/analyzer.types';
import { Sparkles, TrendingUp, ShieldAlert, Target, Clock, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  candidate: TopSwingCandidate;
}

export const TopSwingCard: React.FC<Props> = ({ candidate }) => {
  const { rank, symbol, companyName, currentPrice, swingConvictionScore, minervini, tomorrowPlan, newsSentiment, kiteApiReady } = candidate;

  return (
    <div className="relative bg-[#111622] border border-[#232d42] hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition-all space-y-4">
      {/* Top Banner: Rank & Conviction */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-mono font-black text-sm text-white shadow-md shadow-emerald-500/20">
            #{rank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white tracking-wide">{symbol}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                {minervini.stageLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{companyName}</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400 block">SEPA CONVICTION</span>
          <span className="text-lg font-black text-emerald-400 flex items-center justify-end gap-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {swingConvictionScore.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Minervini SEPA Indicators Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-[#0b0e14] p-3 rounded-xl border border-[#1b2230]">
        <div>
          <span className="text-[10px] text-slate-400 block">RS RANK (0-99)</span>
          <span className="font-bold text-cyan-300">{minervini.rsRanking}/99</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">TREND TEMPLATE</span>
          <span className="font-bold text-emerald-300">{minervini.trendTemplate.passCount}/8 MET</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">VCP QUALITY</span>
          <span className={`font-bold ${minervini.vcp.detected ? 'text-amber-300' : 'text-slate-400'}`}>
            {minervini.vcp.detected ? minervini.vcp.quality : 'NONE'}
          </span>
        </div>
      </div>

      {/* Advanced DSA & Quantitative Alpha Strip */}
      {candidate.advancedQuant && (
        <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono bg-[#070b12] p-2.5 rounded-xl border border-cyan-500/20">
          <div title="Volume Z-Score vs 20-Day Mean">
            <span className="text-slate-400 block text-[9px]">VOL Z-SCORE</span>
            <span className={`font-bold ${candidate.advancedQuant.isPocketPivot ? 'text-emerald-400' : 'text-slate-300'}`}>
              +{candidate.advancedQuant.volumeZScore.toFixed(1)}σ {candidate.advancedQuant.isPocketPivot ? '★' : ''}
            </span>
          </div>
          <div title="Volatility Squeeze Ratio: ATR 5 / ATR 20">
            <span className="text-slate-400 block text-[9px]">ATR SQUEEZE</span>
            <span className={`font-bold ${candidate.advancedQuant.isVolatilityCompressed ? 'text-amber-300' : 'text-slate-300'}`}>
              {candidate.advancedQuant.volatilitySqueezeRatio}x {candidate.advancedQuant.isVolatilityCompressed ? '⚡' : ''}
            </span>
          </div>
          <div title="Mansfield Relative Strength vs Nifty 50">
            <span className="text-slate-400 block text-[9px]">MANSFIELD RS</span>
            <span className={`font-bold ${candidate.advancedQuant.mansfieldRelativeStrength >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {candidate.advancedQuant.mansfieldRelativeStrength >= 0 ? '+' : ''}{candidate.advancedQuant.mansfieldRelativeStrength.toFixed(1)}%
            </span>
          </div>
          <div title="Dynamic Time Warping similarity to VCP multi-bagger breakout">
            <span className="text-slate-400 block text-[9px]">DTW PATTERN</span>
            <span className="font-bold text-cyan-300">
              {candidate.advancedQuant.patternDtwScore}%
            </span>
          </div>
        </div>
      )}

      {/* Tomorrow's Execution Plan */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-[#141b2a] border border-[#232e44] space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
          <span className="font-bold text-slate-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> TOMORROW&apos;S SWING PLAN
          </span>
          <span className="text-emerald-300 font-bold">{tomorrowPlan.holdingPeriod}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div>
            <span className="text-[10px] text-slate-400 block">ENTRY PIVOT</span>
            <span className="font-bold text-white text-sm">₹{tomorrowPlan.entryPivot.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-[10px] text-rose-400 block">HARD STOP LOSS</span>
            <span className="font-bold text-rose-400 text-sm">₹{tomorrowPlan.stopLoss.toFixed(1)}</span>
            <span className="text-[9px] text-slate-500 block">(-{tomorrowPlan.stopLossPercent}%)</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 block">TARGET 1 / 2</span>
            <span className="font-bold text-emerald-300 text-sm">₹{tomorrowPlan.target1.toFixed(1)}</span>
            <span className="text-[9px] text-slate-500 block">(+{tomorrowPlan.target1Percent}%)</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1">
          {tomorrowPlan.executionInstructions}
        </p>
      </div>

      {/* News Catalyst Snippet */}
      {newsSentiment.headlines.length > 0 && (
        <div className="text-[11px] text-slate-400 bg-[#090d14] p-2.5 rounded-lg border border-slate-800/80">
          <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">
            📰 NEWS CATALYST ({newsSentiment.label}):
          </span>
          <p className="italic text-slate-300 line-clamp-2">&ldquo;{newsSentiment.headlines[0]}&rdquo;</p>
        </div>
      )}

      {/* Future Kite API Order Payload Badge */}
      <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
        <span className="flex items-center gap-1 text-slate-400">
          <Zap className="w-3 h-3 text-cyan-400" /> Kite API Ready:
        </span>
        <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 text-[10px] font-bold">
          {kiteApiReady.tradingsymbol} • {kiteApiReady.quantity} Qty • CNC LIMIT
        </span>
      </div>
    </div>
  );
};
