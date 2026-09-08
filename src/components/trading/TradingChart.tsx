'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Candle, Timeframe, TradeSetup } from '@/types/trading.types';
import { TrendingUp, TrendingDown, BarChart2, Maximize2, Layers } from 'lucide-react';

interface TradingChartProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
  activeSetup?: TradeSetup | null;
}

const STOCK_BASE_PRICES: Record<string, number> = {
  TATAMOTORS: 982.5,
  RELIANCE: 2985.0,
  INFY: 1820.0,
  HDFCBANK: 1640.0,
  ICICIBANK: 1210.0,
};

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  onSymbolChange,
  activeSetup,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('5M');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState(STOCK_BASE_PRICES[symbol] || 982.5);
  const [priceChange, setPriceChange] = useState(+14.2);

  // Generate synthetic candles when symbol or timeframe changes
  useEffect(() => {
    const base = STOCK_BASE_PRICES[symbol] || (activeSetup?.entryPrice ?? 1000);
    const generated: Candle[] = [];
    let price = base * 0.985;
    const count = 36;
    const now = new Date();

    const intervalMinutes = timeframe === '1M' ? 1 : timeframe === '5M' ? 5 : timeframe === '15M' ? 15 : 60;

    for (let i = count; i >= 0; i--) {
      const open = price;
      const volatility = base * 0.0035;
      const change = (Math.random() - 0.48) * volatility * 2;
      const close = Math.round((open + change) * 100) / 100;
      const high = Math.round((Math.max(open, close) + Math.random() * volatility) * 100) / 100;
      const low = Math.round((Math.min(open, close) - Math.random() * volatility) * 100) / 100;
      const volume = Math.floor(10000 + Math.random() * 85000);
      price = close;

      const t = new Date(now.getTime() - i * intervalMinutes * 60000);
      generated.push({
        time: `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`,
        open,
        high,
        low,
        close,
        volume,
      });
    }

    setCandles(generated);
    const lastClose = generated[generated.length - 1].close;
    const firstOpen = generated[0].open;
    setCurrentPrice(lastClose);
    setPriceChange(Math.round((lastClose - firstOpen) * 100) / 100);
  }, [symbol, timeframe, activeSetup]);

  // Live micro-tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        const delta = (Math.random() - 0.49) * (prev * 0.0006);
        return Math.round((prev + delta) * 100) / 100;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Canvas drawing loop
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

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    // Compute min and max including active setup levels if applicable
    let allPrices = candles.flatMap((c) => [c.low, c.high]);
    if (activeSetup && activeSetup.symbol === symbol) {
      allPrices = allPrices.concat([activeSetup.entryPrice, activeSetup.stopLoss, activeSetup.target1, activeSetup.target2]);
    }

    const minPrice = Math.min(...allPrices) * 0.998;
    const maxPrice = Math.max(...allPrices) * 1.002;
    const priceRange = maxPrice - minPrice || 1;

    // Background horizontal grid lines
    ctx.strokeStyle = '#1e2533';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const y = (height / 6) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      const priceVal = maxPrice - (i / 6) * priceRange;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`₹${priceVal.toFixed(1)}`, width - 55, y - 4);
    }

    const chartBottom = height - 40;
    const candleWidth = Math.max(4, (width - 70) / candles.length - 3);

    // Draw candles
    candles.forEach((c, idx) => {
      const x = 15 + idx * (candleWidth + 3);
      const openY = chartBottom - ((c.open - minPrice) / priceRange) * (chartBottom - 20);
      const closeY = chartBottom - ((c.close - minPrice) / priceRange) * (chartBottom - 20);
      const highY = chartBottom - ((c.high - minPrice) / priceRange) * (chartBottom - 20);
      const lowY = chartBottom - ((c.low - minPrice) / priceRange) * (chartBottom - 20);

      const isUp = c.close >= c.open;
      const color = isUp ? '#00c087' : '#ff3b69';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Candle Body
      ctx.fillStyle = color;
      const top = Math.min(openY, closeY);
      const barHeight = Math.max(2, Math.abs(closeY - openY));
      ctx.fillRect(x, top, candleWidth, barHeight);
    });

    // Draw Level Overlay Lines (Entry, SL, Targets)
    if (activeSetup && activeSetup.symbol === symbol) {
      const drawLevel = (price: number, label: string, color: string) => {
        const y = chartBottom - ((price - minPrice) / priceRange) * (chartBottom - 20);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(width - 65, y);
        ctx.stroke();

        // Level Pill Tag
        ctx.fillStyle = color;
        ctx.font = 'bold 9px monospace';
        const tagText = `${label}: ₹${price.toFixed(1)}`;
        const textWidth = ctx.measureText(tagText).width;
        ctx.fillRect(width - textWidth - 25, y - 8, textWidth + 12, 16);
        ctx.fillStyle = '#000000';
        ctx.fillText(tagText, width - textWidth - 19, y + 4);
        ctx.restore();
      };

      drawLevel(activeSetup.entryPrice, 'ENTRY', '#f59e0b');
      drawLevel(activeSetup.stopLoss, 'SL', '#ef4444');
      drawLevel(activeSetup.target1, 'T1', '#10b981');
      drawLevel(activeSetup.target2, 'T2', '#059669');
    }
  }, [candles, symbol, activeSetup]);

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={symbol}
                onChange={(e) => onSymbolChange?.(e.target.value)}
                className="bg-[#0b0e14] border border-[#232936] text-white font-bold text-sm px-2.5 py-1 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="TATAMOTORS">TATAMOTORS (NSE)</option>
                <option value="RELIANCE">RELIANCE (NSE)</option>
                <option value="INFY">INFY (NSE)</option>
                <option value="HDFCBANK">HDFCBANK (NSE)</option>
                <option value="ICICIBANK">ICICIBANK (NSE)</option>
              </select>

              {activeSetup && activeSetup.symbol === symbol && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> LEVELS ACTIVE
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xl font-bold text-white">₹{currentPrice.toFixed(2)}</span>
              <span className={`text-xs font-mono font-medium flex items-center ${priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {priceChange >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {priceChange >= 0 ? `+₹${priceChange.toFixed(2)}` : `-₹${Math.abs(priceChange).toFixed(2)}`} (
                {((priceChange / currentPrice) * 100).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-1 bg-[#0b0e14] border border-[#232936] p-1 rounded-xl">
          {(['1M', '5M', '15M', '1D'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Full view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Candlestick Canvas Container */}
      <div className="w-full h-80 relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Chart Footer Indicator Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#232936]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00c087]" /> Bullish Candle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff3b69]" /> Bearish Candle
          </span>
          {activeSetup && activeSetup.symbol === symbol && (
            <>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-0.5 bg-amber-400" /> Entry Zone
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-0.5 bg-rose-400" /> Stop Loss
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-0.5 bg-emerald-400" /> Targets (T1/T2)
              </span>
            </>
          )}
        </div>
        <div>Volume: Real-Time Aggregate</div>
      </div>
    </div>
  );
};
