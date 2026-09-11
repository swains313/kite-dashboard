'use client';

import React from 'react';
import {
  GeminiPrediction,
  QuantitativePrediction,
  XGBoostPrediction,
} from '@/types/ai.types';
import { Cpu, Sparkles, Activity, CheckCircle2, XCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface AIModelCardsProps {
  xgboost: XGBoostPrediction;
  gemini: GeminiPrediction;
  quantitative: QuantitativePrediction;
}

export const AIModelCards: React.FC<AIModelCardsProps> = ({
  xgboost,
  gemini,
  quantitative,
}) => {
  const getSignalBadge = (sig: string) => {
    switch (sig) {
      case 'STRONG_BUY':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'BUY':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'NEUTRAL':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'AVOID':
      case 'SELL':
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
  };

  const getProbColor = (p: number) => {
    if (p >= 75) return 'text-emerald-400';
    if (p >= 60) return 'text-teal-300';
    if (p >= 45) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card 1: XGBoost ML Model */}
      <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-white tracking-wide">{xgboost.modelName}</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
            ML Classifier
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-[#232936] p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Model Confidence</span>
            <div className={`font-mono text-2xl font-extrabold mt-0.5 ${getProbColor(xgboost.probability)}`}>
              {xgboost.probability.toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-500">{xgboost.confidenceTier}</span>
          </div>

          <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${getSignalBadge(xgboost.signal)}`}>
            {xgboost.signal}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-300 block">Top Feature Drivers:</span>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0b0e14] border border-[#232936] p-2 rounded-lg text-center">
              <span className="text-[9px] text-slate-400 block">Order Imbalance</span>
              <span className="font-mono font-bold text-slate-200 mt-0.5 block">
                {xgboost.keyDrivers.orderFlowImbalance}%
              </span>
            </div>
            <div className="bg-[#0b0e14] border border-[#232936] p-2 rounded-lg text-center">
              <span className="text-[9px] text-slate-400 block">Vol. Surge</span>
              <span className="font-mono font-bold text-slate-200 mt-0.5 block">
                {xgboost.keyDrivers.volumeSurgeRatio}x
              </span>
            </div>
            <div className="bg-[#0b0e14] border border-[#232936] p-2 rounded-lg text-center">
              <span className="text-[9px] text-slate-400 block">Volatility Ratio</span>
              <span className="font-mono font-bold text-slate-200 mt-0.5 block">
                {xgboost.keyDrivers.volatilityExpansion}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Gemini 2.5 Market Reasoner */}
      <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white tracking-wide">{gemini.modelName}</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
            LLM Reasoner
          </span>
        </div>

        <div className="p-3 bg-[#0b0e14] border border-[#232936] rounded-xl text-xs space-y-2">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Thesis:</span>
            <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{gemini.marketThesis}</p>
          </div>

          <div className="pt-2 border-t border-[#232936] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Sector Alpha:</span>
            <span className="font-mono font-bold text-emerald-400">{gemini.sectorSentiment}</span>
          </div>
        </div>

        <div className="p-3 bg-blue-950/20 border border-blue-800/30 rounded-xl text-xs text-blue-200 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[11px] text-blue-300">
            <Lightbulb className="w-3.5 h-3.5" /> Execution Advice:
          </div>
          <p className="text-[11px] text-slate-300">{gemini.executionAdvice}</p>
        </div>
      </div>

      {/* Card 3: Quantitative Technical Engine */}
      <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white tracking-wide">
              {quantitative.minervini ? 'Minervini SEPA Engine' : quantitative.modelName}
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {quantitative.minervini ? `${quantitative.minervini.stage} // RS ${quantitative.minervini.rsRanking}` : 'Rule Engine'}
          </span>
        </div>

        {quantitative.minervini ? (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0b0e14] border border-[#232936] p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">SEPA VERDICT</span>
                <span
                  className={`font-mono font-black text-base mt-0.5 block ${
                    quantitative.minervini.minerviniVerdict === 'BUY'
                      ? 'text-emerald-400'
                      : quantitative.minervini.minerviniVerdict === 'HOLD'
                      ? 'text-cyan-300'
                      : 'text-rose-400'
                  }`}
                >
                  {quantitative.minervini.minerviniVerdict}
                </span>
              </div>

              <div className="bg-[#0b0e14] border border-[#232936] p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">TREND TEMPLATE</span>
                <span
                  className={`font-mono font-bold text-base mt-0.5 block ${
                    quantitative.minervini.trendTemplate.allPassed
                      ? 'text-emerald-400'
                      : quantitative.minervini.trendTemplate.passCount >= 6
                      ? 'text-teal-300'
                      : 'text-amber-400'
                  }`}
                >
                  {quantitative.minervini.trendTemplate.passCount} / 8 Passed
                </span>
              </div>

              <div className="bg-[#0b0e14] border border-[#232936] p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">MARKET STAGE</span>
                <span className="font-mono font-bold text-xs text-slate-200 mt-0.5 block truncate">
                  {quantitative.minervini.stageLabel}
                </span>
              </div>

              <div className="bg-[#0b0e14] border border-[#232936] p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">RS RANKING (vs NIFTY)</span>
                <span
                  className={`font-mono font-bold text-base mt-0.5 block ${
                    quantitative.minervini.rsRanking >= 70
                      ? 'text-emerald-400'
                      : quantitative.minervini.rsRanking >= 50
                      ? 'text-amber-300'
                      : 'text-rose-400'
                  }`}
                >
                  {quantitative.minervini.rsRanking} / 99
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-[#0b0e14] border border-[#232936] rounded-xl text-[11px] font-mono text-slate-300 leading-relaxed">
              <span className="text-amber-400 font-bold block mb-0.5">Minervini Thesis:</span>
              {quantitative.minervini.verdictReason}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
              <span>SMA50: ₹{quantitative.minervini.sma50.toFixed(1)}</span>
              <span>SMA150: ₹{quantitative.minervini.sma150.toFixed(1)}</span>
              <span>SMA200: ₹{quantitative.minervini.sma200.toFixed(1)}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 block">VWAP Alignment</span>
              <span
                className={`font-mono font-bold text-sm mt-0.5 flex items-center gap-1 ${
                  quantitative.vwapStatus === 'ABOVE' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {quantitative.vwapStatus === 'ABOVE' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {quantitative.vwapStatus} VWAP
              </span>
            </div>

            <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 block">9/20 EMA Cross</span>
              <span
                className={`font-mono font-bold text-sm mt-0.5 flex items-center gap-1 ${
                  quantitative.emaAlignment === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {quantitative.emaAlignment === 'BULLISH' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {quantitative.emaAlignment}
              </span>
            </div>

            <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 block">RSI Momentum (14)</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`font-mono font-bold text-sm ${
                    quantitative.rsiValue > 70
                      ? 'text-amber-400'
                      : quantitative.rsiValue >= 50
                      ? 'text-emerald-400'
                      : quantitative.rsiValue >= 40
                      ? 'text-blue-400'
                      : 'text-rose-400'
                  }`}
                >
                  {quantitative.rsiValue.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 block">ATR Volatility (₹)</span>
              <span className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                ₹{quantitative.atrValue.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
