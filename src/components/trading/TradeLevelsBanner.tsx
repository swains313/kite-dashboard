'use client';

import React from 'react';
import { Clock, ShieldAlert, Target, TrendingUp, TrendingDown, MinusCircle, Scale, Zap, Calendar } from 'lucide-react';

interface TradeLevelsBannerProps {
  symbol: string;
  companyName: string;
  direction: 'BUY' | 'HOLD' | 'SELL' | 'NEUTRAL';
  tradeType: 'INTRADAY' | 'SWING';
  holdingPeriod: string;
  buyTime: string;
  entryPrice: number;
  entryRange: string;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;
  target1Percent: number;
  target2: number;
  target2Percent: number;
  riskReward: string;
}

export const TradeLevelsBanner: React.FC<TradeLevelsBannerProps> = ({
  symbol,
  companyName,
  direction,
  tradeType,
  holdingPeriod,
  buyTime,
  entryPrice,
  entryRange,
  stopLoss,
  stopLossPercent,
  target1,
  target1Percent,
  target2,
  target2Percent,
  riskReward,
}) => {
  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            {tradeType} Execution Levels ({symbol} - {companyName})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              tradeType === 'INTRADAY'
                ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                : 'bg-purple-500/15 border-purple-500/30 text-purple-400'
            }`}
          >
            {tradeType}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
              direction === 'BUY'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : direction === 'HOLD'
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                : direction === 'SELL'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}
          >
            {direction === 'BUY' ? (
              <TrendingUp className="w-3 h-3" />
            ) : direction === 'HOLD' ? (
              <MinusCircle className="w-3 h-3 text-cyan-300" />
            ) : direction === 'SELL' ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <MinusCircle className="w-3 h-3" />
            )}
            {direction === 'BUY'
              ? 'BUY SETUP'
              : direction === 'HOLD'
              ? 'HOLD ACTIVE'
              : direction === 'SELL'
              ? 'SELL / AVOID'
              : 'WAIT FOR TRIGGER'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Execution Timing / Horizon */}
        <div className="bg-[#0b0e14] border border-amber-500/30 p-3 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            {tradeType === 'INTRADAY' ? <Clock className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
            {tradeType === 'INTRADAY' ? 'Timing Window' : 'Holding Horizon'}
          </span>
          <div className="font-mono font-bold text-white text-xs leading-snug">
            {tradeType === 'INTRADAY' ? buyTime : holdingPeriod}
          </div>
          <span className="text-[10px] text-slate-400 block">
            {direction === 'BUY'
              ? 'Optimal Volatility Session'
              : direction === 'SELL'
              ? 'Distribution Pressure'
              : 'Wait for Confirmed Breakout'}
          </span>
        </div>

        {/* Entry Zone */}
        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            {direction === 'NEUTRAL' ? 'Trigger Level' : direction === 'SELL' ? 'Short Entry' : 'Buy Entry'}
          </span>
          <div className="font-mono font-bold text-amber-400 text-sm">₹{entryPrice.toFixed(2)}</div>
          <span className="text-[10px] font-mono text-slate-400 block">{entryRange}</span>
        </div>

        {/* Stop Loss */}
        <div className="bg-[#0b0e14] border border-rose-900/30 p-3 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Stop Loss (SL)
          </span>
          <div className="font-mono font-bold text-rose-400 text-sm">₹{stopLoss.toFixed(2)}</div>
          <span className="text-[10px] font-mono text-rose-400/80 block">
            {direction === 'SELL' ? `+${stopLossPercent}% (Inversion SL)` : `-${stopLossPercent}% (Strict Limit)`}
          </span>
        </div>

        {/* Targets T1 & T2 */}
        <div className="bg-[#0b0e14] border border-emerald-900/30 p-3 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Target 1 (T1)
          </span>
          <div className="font-mono font-bold text-emerald-400 text-sm">₹{target1.toFixed(2)}</div>
          <span className="text-[10px] font-mono text-emerald-400/80 block">
            {direction === 'SELL' ? `-${target1Percent}% (Downside T1)` : `+${target1Percent}%`}
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-teal-900/30 p-3 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" /> Target 2 (T2)
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">{riskReward}</span>
          </div>
          <div className="font-mono font-bold text-teal-400 text-sm">₹{target2.toFixed(2)}</div>
          <span className="text-[10px] font-mono text-teal-400/80 block">
            {direction === 'SELL' ? `-${target2Percent}% (Downside T2)` : `+${target2Percent}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
