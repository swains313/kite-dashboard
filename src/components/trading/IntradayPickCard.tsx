'use client';

import React, { useState } from 'react';
import { TradeSetup } from '@/types/trading.types';
import { Sparkles, TrendingUp, TrendingDown, Target, ShieldAlert, CheckCircle2, RefreshCw, BarChart2, Zap } from 'lucide-react';

const SAMPLE_SETUPS: TradeSetup[] = [
  {
    id: 'setup-1',
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd (NSE)',
    direction: 'BUY',
    entryPrice: 982.5,
    entryRange: '₹982.00 - ₹984.50',
    stopLoss: 972.0,
    stopLossPercent: 1.07,
    target1: 998.0,
    target1Percent: 1.58,
    target2: 1008.0,
    target2Percent: 2.6,
    riskReward: '1 : 2.43',
    confidenceScore: 89.2,
    rationale: 'Clean morning consolidation breakout above 20 EMA and VWAP on 5M timeframe. High relative volume (2.8x 10-day avg) with RSI momentum holding strong at 63.4.',
    indicators: {
      vwap: 'ABOVE',
      emaCross: 'BULLISH',
      relativeVolume: '2.8x',
      rsi: 63.4,
    },
  },
  {
    id: 'setup-2',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd (NSE)',
    direction: 'BUY',
    entryPrice: 2985.0,
    entryRange: '₹2982.00 - ₹2988.00',
    stopLoss: 2955.0,
    stopLossPercent: 1.01,
    target1: 3030.0,
    target1Percent: 1.51,
    target2: 3060.0,
    target2Percent: 2.51,
    riskReward: '1 : 2.50',
    confidenceScore: 86.8,
    rationale: 'Heavy institutional volume absorption at major demand zone (₹2975). MACD histogram flipped positive with 9/20 EMA bullish divergence on 15M chart.',
    indicators: {
      vwap: 'ABOVE',
      emaCross: 'BULLISH',
      relativeVolume: '2.3x',
      rsi: 58.9,
    },
  },
  {
    id: 'setup-3',
    symbol: 'INFY',
    companyName: 'Infosys Ltd (NSE)',
    direction: 'SELL',
    entryPrice: 1820.0,
    entryRange: '₹1820.00 - ₹1824.00',
    stopLoss: 1838.0,
    stopLossPercent: 0.99,
    target1: 1792.0,
    target1Percent: 1.54,
    target2: 1775.0,
    target2Percent: 2.47,
    riskReward: '1 : 2.50',
    confidenceScore: 84.5,
    rationale: 'Failed break of daily high followed by strong rejection candle under VWAP. Sellers dominating order book delta with RSI dropping below 45 on 5M timeframe.',
    indicators: {
      vwap: 'BELOW',
      emaCross: 'BEARISH',
      relativeVolume: '2.1x',
      rsi: 41.2,
    },
  },
];

interface IntradayPickCardProps {
  onSelectSetup: (setup: TradeSetup) => void;
  onPrefillOrder: (setup: TradeSetup) => void;
  activeSetupId?: string;
}

export const IntradayPickCard: React.FC<IntradayPickCardProps> = ({
  onSelectSetup,
  onPrefillOrder,
  activeSetupId,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const currentSetup = SAMPLE_SETUPS[selectedIdx];

  const handleScanNext = () => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedIdx((prev) => (prev + 1) % SAMPLE_SETUPS.length);
      setIsScanning(false);
    }, 450);
  };

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Today&apos;s Best Intraday Pick</h3>
        </div>
        <button
          type="button"
          onClick={handleScanNext}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0b0e14] border border-[#232936] hover:border-blue-500/50 text-[11px] font-mono text-slate-300 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 text-blue-400 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Next Best Pick'}
        </button>
      </div>

      {/* Stock Symbol & Direction Banner */}
      <div className="bg-[#0b0e14] border border-[#232936] rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-mono text-white">{currentSetup.symbol}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                currentSetup.direction === 'BUY'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {currentSetup.direction === 'BUY' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {currentSetup.direction} (INTRADAY)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{currentSetup.companyName}</p>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-mono text-slate-400">AI Conviction</div>
          <div className="text-base font-bold font-mono text-emerald-400">
            {currentSetup.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Levels Matrix: Entry | Stop Loss | Targets */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {/* Entry Price */}
        <div className="bg-[#0b0e14] border border-[#232936] p-2.5 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Entry Zone</span>
          <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">₹{currentSetup.entryPrice.toFixed(2)}</div>
          <span className="text-[10px] font-mono text-slate-500 truncate block mt-0.5">{currentSetup.entryRange}</span>
        </div>

        {/* Stop Loss */}
        <div className="bg-[#0b0e14] border border-rose-900/30 p-2.5 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-rose-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" /> Stop Loss
          </span>
          <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">₹{currentSetup.stopLoss.toFixed(2)}</div>
          <span className="text-[10px] font-mono text-rose-400/80 block mt-0.5">-{currentSetup.stopLossPercent}% (Risk)</span>
        </div>

        {/* Targets */}
        <div className="bg-[#0b0e14] border border-emerald-900/30 p-2.5 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-emerald-400 flex items-center gap-1">
            <Target className="w-3 h-3 text-emerald-400" /> Targets
          </span>
          <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">₹{currentSetup.target1.toFixed(2)}</div>
          <span className="text-[10px] font-mono text-emerald-400/80 block mt-0.5">T2: ₹{currentSetup.target2.toFixed(2)}</span>
        </div>
      </div>

      {/* Risk-Reward & Technical Tags */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
          R:R {currentSetup.riskReward}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#0b0e14] border border-[#232936] text-slate-400">
          VWAP: {currentSetup.indicators.vwap}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#0b0e14] border border-[#232936] text-slate-400">
          Vol: {currentSetup.indicators.relativeVolume}
        </span>
        <span className="px-2 py-0.5 rounded bg-[#0b0e14] border border-[#232936] text-slate-400">
          RSI: {currentSetup.indicators.rsi}
        </span>
      </div>

      {/* Algorithmic Rationale */}
      <div className="p-3 bg-[#0b0e14] border border-[#232936] rounded-xl text-xs space-y-1">
        <div className="font-semibold text-slate-300 flex items-center gap-1.5 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Technical & Algorithmic Thesis:
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {currentSetup.rationale}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onSelectSetup(currentSetup)}
          className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
            activeSetupId === currentSetup.id
              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
              : 'bg-[#0b0e14] border-[#232936] hover:border-blue-500/50 text-slate-200 hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
          {activeSetupId === currentSetup.id ? 'Plotted on Chart ✓' : 'Plot on Chart'}
        </button>

        <button
          type="button"
          onClick={() => onPrefillOrder(currentSetup)}
          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20"
        >
          <Zap className="w-3.5 h-3.5" />
          Pre-fill Order
        </button>
      </div>
    </div>
  );
};
