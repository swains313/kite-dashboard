'use client';

import React, { useMemo, useState } from 'react';
import { ChartBar, ChartData } from '@/types/picks.types';

export interface PriceLevel {
  price: number;
  label: string;
  tone: 'entry' | 'stop' | 'target';
}

const TONE: Record<PriceLevel['tone'], string> = {
  entry: '#60a5fa',
  stop: '#fb7185',
  target: '#34d399',
};

const W = 900;
const H = 380;
const PAD = { top: 14, right: 62, bottom: 26, left: 10 };
const VOL_H = 56;

/**
 * Candlestick chart drawn as inline SVG.
 *
 * Hand-rolled rather than pulled from a charting library: the page needs one
 * chart type with price levels overlaid, and an SVG the component owns keeps the
 * bundle small and the level rendering exact.
 */
export function CandleChart({
  chart,
  levels = [],
}: {
  chart: ChartData;
  levels?: PriceLevel[];
}) {
  const [hover, setHover] = useState<number | null>(null);

  const geometry = useMemo(() => {
    const bars = chart.bars;
    if (bars.length === 0) return null;

    const plotH = H - PAD.top - PAD.bottom - VOL_H;
    const plotW = W - PAD.left - PAD.right;

    // Include the overlay levels in the domain, or a stop below the visible range
    // would be drawn off-canvas.
    const levelPrices = levels.map((l) => l.price);
    const lo = Math.min(...bars.map((b) => b.low), ...levelPrices);
    const hi = Math.max(...bars.map((b) => b.high), ...levelPrices);
    const pad = (hi - lo) * 0.06 || 1;
    const min = lo - pad;
    const max = hi + pad;

    const maxVol = Math.max(...bars.map((b) => b.volume), 1);
    const step = plotW / bars.length;
    const candleW = Math.max(1.5, Math.min(9, step * 0.62));

    const x = (i: number) => PAD.left + i * step + step / 2;
    const y = (p: number) => PAD.top + ((max - p) / (max - min)) * plotH;
    const volY = (v: number) => H - PAD.bottom - (v / maxVol) * VOL_H;

    const line = (key: 'sma20' | 'sma50') =>
      bars
        .map((b, i) => (b[key] == null ? null : `${x(i)},${y(b[key] as number)}`))
        .filter(Boolean)
        .join(' ');

    // Five gridlines across the price domain.
    const ticks = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);

    return { bars, x, y, volY, candleW, step, min, max, ticks, plotH, sma20: line('sma20'), sma50: line('sma50') };
  }, [chart, levels]);

  if (!geometry) {
    return (
      <div className="grid h-64 place-items-center text-sm text-slate-500">No chart data.</div>
    );
  }

  const { bars, x, y, volY, candleW, step, ticks, sma20, sma50 } = geometry;
  const active: ChartBar | null = hover != null ? bars[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 'auto' }}>
        {/* Gridlines + price axis */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="#1e293b"
              strokeWidth="1"
            />
            <text x={W - PAD.right + 6} y={y(t) + 3.5} fill="#64748b" fontSize="10">
              {t.toFixed(t > 1000 ? 0 : 1)}
            </text>
          </g>
        ))}

        {/* Volume */}
        {bars.map((b, i) => (
          <rect
            key={`v${i}`}
            x={x(i) - candleW / 2}
            y={volY(b.volume)}
            width={candleW}
            height={H - PAD.bottom - volY(b.volume)}
            fill={b.close >= b.open ? '#134e4a' : '#4c1d24'}
          />
        ))}

        {/* Moving averages */}
        {sma50 && <polyline points={sma50} fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.8" />}
        {sma20 && <polyline points={sma20} fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />}

        {/* Candles */}
        {bars.map((b, i) => {
          const up = b.close >= b.open;
          const colour = up ? '#10b981' : '#f43f5e';
          const top = y(Math.max(b.open, b.close));
          const bodyH = Math.max(1, Math.abs(y(b.open) - y(b.close)));
          return (
            <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={y(b.high)} y2={y(b.low)} stroke={colour} strokeWidth="1" />
              <rect x={x(i) - candleW / 2} y={top} width={candleW} height={bodyH} fill={colour} />
            </g>
          );
        })}

        {/* Level overlays */}
        {levels.map((l) => (
          <g key={l.label}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(l.price)}
              y2={y(l.price)}
              stroke={TONE[l.tone]}
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.85"
            />
            <text x={PAD.left + 4} y={y(l.price) - 4} fill={TONE[l.tone]} fontSize="10" fontWeight="600">
              {l.label} {l.price}
            </text>
          </g>
        ))}

        {/* Crosshair */}
        {active && hover != null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.5"
          />
        )}

        {/* Hover targets */}
        {bars.map((_, i) => (
          <rect
            key={`h${i}`}
            x={x(i) - step / 2}
            y={0}
            width={step}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>

      {/* Readout */}
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11px] tabular-nums">
        {active ? (
          <>
            <span className="text-slate-500">{active.date}</span>
            <span className="text-slate-400">
              O <span className="text-slate-200">{active.open}</span>
            </span>
            <span className="text-slate-400">
              H <span className="text-emerald-400">{active.high}</span>
            </span>
            <span className="text-slate-400">
              L <span className="text-rose-400">{active.low}</span>
            </span>
            <span className="text-slate-400">
              C <span className="text-slate-200">{active.close}</span>
            </span>
            <span className="text-slate-400">
              Vol <span className="text-slate-300">{(active.volume / 1000).toFixed(0)}k</span>
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-0.5 w-3 rounded" style={{ background: '#38bdf8' }} /> 20-DMA
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-0.5 w-3 rounded" style={{ background: '#f59e0b' }} /> 50-DMA
            </span>
            <span className="text-slate-600">hover a candle for OHLC</span>
          </>
        )}
      </div>
    </div>
  );
}
