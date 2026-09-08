'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, BarChart2, Maximize2 } from 'lucide-react';

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const TradingChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [symbol] = useState('NIFTY 50');
  const [currentPrice, setCurrentPrice] = useState(24385.5);
  const [priceChange, setPriceChange] = useState(+142.3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate sample financial candles
    const candles: Candle[] = [];
    let price = 24250;
    const now = new Date();

    for (let i = 40; i >= 0; i--) {
      const open = price;
      const variation = (Math.random() - 0.48) * 35;
      const close = Math.round((open + variation) * 10) / 10;
      const high = Math.round((Math.max(open, close) + Math.random() * 15) * 10) / 10;
      const low = Math.round((Math.min(open, close) - Math.random() * 15) * 10) / 10;
      price = close;

      const t = new Date(now.getTime() - i * 60000);
      candles.push({
        time: `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`,
        open,
        high,
        low,
        close,
      });
    }

    setCurrentPrice(candles[candles.length - 1].close);
    setPriceChange(Math.round((candles[candles.length - 1].close - candles[0].open) * 10) / 10);

    // Draw chart
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1a202c';
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const minPrice = Math.min(...candles.map((c) => c.low)) - 10;
    const maxPrice = Math.max(...candles.map((c) => c.high)) + 10;
    const priceRange = maxPrice - minPrice || 1;

    const candleWidth = Math.max(4, (width - 60) / candles.length - 3);

    candles.forEach((c, idx) => {
      const x = 20 + idx * (candleWidth + 3);
      const openY = height - 30 - ((c.open - minPrice) / priceRange) * (height - 60);
      const closeY = height - 30 - ((c.close - minPrice) / priceRange) * (height - 60);
      const highY = height - 30 - ((c.high - minPrice) / priceRange) * (height - 60);
      const lowY = height - 30 - ((c.low - minPrice) / priceRange) * (height - 60);

      const isUp = c.close >= c.open;
      const color = isUp ? '#00c087' : '#ff3b69';

      // Wick
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Body
      ctx.fillStyle = color;
      const top = Math.min(openY, closeY);
      const barHeight = Math.max(2, Math.abs(closeY - openY));
      ctx.fillRect(x, top, candleWidth, barHeight);
    });
  }, []);

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">{symbol}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0b0e14] border border-[#232936] text-slate-400">
                1M INTERVAL
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-lg font-bold text-white">{currentPrice.toFixed(2)}</span>
              <span className={`text-xs font-mono font-medium flex items-center ${priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
                {priceChange >= 0 ? `+${priceChange.toFixed(2)}` : priceChange.toFixed(2)} ({((priceChange / currentPrice) * 100).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-[#0b0e14] border border-[#232936] text-slate-400 hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full h-72 relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
