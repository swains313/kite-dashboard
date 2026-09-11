'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CandlePoint, Timeframe } from '@/types/ai.types';
import { TrendingUp, TrendingDown, BarChart2, Clock, Layers } from 'lucide-react';
import { drawChartCanvas } from './chartDrawer';

interface DynamicStockChartProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  direction: 'BUY' | 'HOLD' | 'SELL' | 'NEUTRAL';
  buyTime: string;
  entryPrice: number;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;
  target1Percent: number;
  target2: number;
  target2Percent: number;
  candles: CandlePoint[];
  onTimeframeChange?: (tf: Timeframe) => void;
}

export const DynamicStockChart: React.FC<DynamicStockChartProps> = ({
  symbol,
  companyName,
  currentPrice: initialPrice,
  direction,
  buyTime,
  entryPrice,
  stopLoss,
  stopLossPercent,
  target1,
  target1Percent,
  target2,
  target2Percent,
  candles,
  onTimeframeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('5M');
  const [showVWAP, setShowVWAP] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  const livePrice = initialPrice;

  // Regular NSE trading hours (Mon-Fri, 9:15 AM - 3:30 PM IST)
  const isMarketOpen = () => {
    const now = new Date();
    const ist = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 19800000);
    const day = ist.getDay(), m = ist.getHours() * 60 + ist.getMinutes();
    return day >= 1 && day <= 5 && m >= 555 && m <= 930;
  };

  const marketActive = isMarketOpen();

  // Canvas drawing loop with indicators & volume
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    drawChartCanvas({
      ctx, width: rect.width, height: rect.height, candles, entryPrice,
      stopLoss, stopLossPercent, target1, target1Percent, target2, target2Percent,
      showVWAP, showEMA, showVolume,
    });
  }, [candles, livePrice, entryPrice, stopLoss, stopLossPercent, target1, target1Percent, target2, target2Percent, showVWAP, showEMA, showVolume]);

  const handleTimeframe = (tf: Timeframe) => {
    setTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  const firstPrice = candles[0]?.open || livePrice;
  const sessionChange = Math.round((livePrice - firstPrice) * 100) / 100;
  const sessionChangePct = Math.round(((livePrice - firstPrice) / firstPrice) * 10000) / 100;

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Segment Header: "Chart" (Always Visible) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">Chart</h2>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                {symbol}
              </span>
              <span className="text-xs text-slate-400 font-medium">{companyName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-1">
              <span className="font-mono text-xl font-bold text-white">₹{livePrice.toFixed(2)}</span>
              {sessionChange !== 0 && (
                <span
                  className={`text-xs font-mono font-semibold flex items-center ${
                    sessionChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {sessionChange >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {sessionChange >= 0
                    ? `+₹${sessionChange.toFixed(2)} (+${sessionChangePct}%)`
                    : `-₹${Math.abs(sessionChange).toFixed(2)} (${sessionChangePct}%)`}
                </span>
              )}
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                  marketActive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    marketActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {marketActive ? 'LIVE NSE FEED' : 'MARKET CLOSED (Settled LTP)'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-[#0b0e14] px-2 py-0.5 rounded border border-[#232936]">
                <Clock className="w-3 h-3 text-amber-400" /> Buy Time: {buyTime}
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe & Overlay Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Indicator Overlays */}
          <div className="flex items-center gap-1 bg-[#0b0e14] border border-[#232936] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setShowVWAP(!showVWAP)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                showVWAP
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle VWAP"
            >
              VWAP
            </button>
            <button
              type="button"
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                showEMA
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle 9/20 EMA"
            >
              EMA 9/20
            </button>
            <button
              type="button"
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                showVolume
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Volume"
            >
              VOL
            </button>
          </div>

          {/* Timeframe Controls */}
          <div className="flex items-center gap-1 bg-[#0b0e14] border border-[#232936] p-1 rounded-xl">
            {(['1M', '5M', '15M', '1D'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => handleTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prominent Action Decision Banner (Hold vs Sell) */}
      <div
        className={`px-3.5 py-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${
          direction === 'BUY'
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : direction === 'HOLD'
            ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
            : direction === 'SELL'
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
            : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase px-2 py-0.5 rounded bg-black/40 border border-current text-[10px]">
            {direction === 'BUY'
              ? 'DECISION: BUY / ACCUMULATE (Stage 2 Breakout)'
              : direction === 'HOLD'
              ? 'DECISION: HOLD (Trend In Progress)'
              : direction === 'SELL'
              ? 'DECISION: SELL / EXIT (Minervini Rule Violation)'
              : 'DECISION: WAIT FOR TRIGGER'}
          </span>
          <span className="text-[11px] text-slate-300">
            {direction === 'BUY'
              ? `Confirmed Stage 2 setup. Stop loss at ₹${stopLoss.toFixed(1)} (-${stopLossPercent}%) is safe. Target ₹${target1.toFixed(1)} pending.`
              : direction === 'HOLD'
              ? `Holding trend structure above key moving averages. Trail stop loss at ₹${stopLoss.toFixed(1)} (-${stopLossPercent}%). Protect capital.`
              : direction === 'SELL'
              ? `Breakdown detected or below 50-day SMA. Minervini rule: Cut losses quickly to protect capital.`
              : `Consolidation zone. Wait for breakout confirmation above pivot.`}
          </span>
        </div>
      </div>

      {/* Candlestick Canvas Container */}
      <div className="w-full relative" style={{ height: '340px' }}>
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Chart Level Indicators Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#232936]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2 h-0.5 bg-amber-400" /> Entry: ₹{entryPrice.toFixed(1)}
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2 h-0.5 bg-rose-400" /> Stop Loss: ₹{stopLoss.toFixed(1)} (-{stopLossPercent}%)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-0.5 bg-emerald-400" /> Target 1: ₹{target1.toFixed(1)} (+{target1Percent}%)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span className="w-2 h-0.5 bg-cyan-400" /> Target 2: ₹{target2.toFixed(1)} (+{target2Percent}%)
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[10px]">
          {showVWAP && <span className="text-amber-400 font-bold">• VWAP</span>}
          {showEMA && (
            <span className="text-purple-400 font-bold">
              • <span className="text-cyan-400">9</span>/20 EMA
            </span>
          )}
          {showVolume && <span className="text-slate-400">• Volume</span>}
        </div>
      </div>
    </div>
  );
};
