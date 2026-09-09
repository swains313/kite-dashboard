import { CandlePoint } from '@/types/ai.types';

export interface DrawChartOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  candles: CandlePoint[];
  entryPrice: number;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;
  target1Percent: number;
  target2: number;
  target2Percent: number;
  showVWAP: boolean;
  showEMA: boolean;
  showVolume: boolean;
}

export function drawChartCanvas(opts: DrawChartOptions) {
  const {
    ctx,
    width,
    height,
    candles,
    entryPrice,
    stopLoss,
    stopLossPercent,
    target1,
    target1Percent,
    target2,
    target2Percent,
    showVWAP,
    showEMA,
    showVolume,
  } = opts;

  if (candles.length === 0) return;

  const allPrices = candles
    .flatMap((c) => [c.low, c.high])
    .concat([entryPrice, stopLoss, target1, target2]);

  const minPrice = Math.min(...allPrices) * 0.997;
  const maxPrice = Math.max(...allPrices) * 1.003;
  const priceRange = maxPrice - minPrice || 1;

  const chartBottom = showVolume ? height * 0.76 : height - 32;
  const volumeHeight = showVolume ? height * 0.2 : 0;
  const getY = (p: number) => chartBottom - ((p - minPrice) / priceRange) * (chartBottom - 20);

  // Horizontal Grid lines & price axis
  ctx.strokeStyle = '#1e2533';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 5; i++) {
    const y = (chartBottom / 6) * i + 10;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width - 65, y);
    ctx.stroke();

    const priceVal = maxPrice - (i / 6) * priceRange;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(`₹${priceVal.toFixed(1)}`, width - 58, y + 3);
  }

  const n = candles.length;
  const candleSpacing = (width - 70) / n;
  const candleWidth = Math.max(3, Math.min(12, candleSpacing * 0.65));

  // Max volume for scaling volume bars
  const maxVol = Math.max(...candles.map((c) => c.volume)) || 1;

  // Draw Candlesticks & Volume Bars
  candles.forEach((c, idx) => {
    const x = 12 + idx * candleSpacing + candleSpacing / 2;
    const isBullish = c.close >= c.open;
    const color = isBullish ? '#10b981' : '#f43f5e';

    // Volume bar at bottom
    if (showVolume) {
      const vH = (c.volume / maxVol) * volumeHeight;
      const vY = height - vH - 6;
      ctx.fillStyle = isBullish ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.28)';
      ctx.fillRect(x - candleWidth / 2, vY, candleWidth, vH);
    }

    // Wick
    const yHigh = getY(c.high);
    const yLow = getY(c.low);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, yHigh);
    ctx.lineTo(x, yLow);
    ctx.stroke();

    // Body
    const yOpen = getY(c.open);
    const yClose = getY(c.close);
    const topY = Math.min(yOpen, yClose);
    const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
    ctx.fillStyle = color;
    ctx.fillRect(x - candleWidth / 2, topY, candleWidth, bodyHeight);
  });

  // Helper to draw smooth curves
  const drawLineCurve = (data: number[], strokeColor: string, isDashed = false) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    if (isDashed) ctx.setLineDash([4, 4]);
    else ctx.setLineDash([]);
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = 12 + i * candleSpacing + candleSpacing / 2;
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Draw VWAP line (Gold)
  if (showVWAP) {
    drawLineCurve(candles.map((c) => c.vwap), 'rgba(251, 191, 36, 0.85)', true);
  }

  // Draw 9 EMA (Cyan) and 20 EMA (Purple)
  if (showEMA) {
    drawLineCurve(candles.map((c) => c.ema9), 'rgba(56, 189, 248, 0.85)');
    drawLineCurve(candles.map((c) => c.ema20), 'rgba(168, 85, 247, 0.85)');
  }

  // Helper for Horizontal Execution Level lines
  const drawLevelLine = (price: number, color: string, label: string) => {
    const y = getY(price);
    if (y < 0 || y > chartBottom + 15) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(width - 70, y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = color;
    ctx.font = 'bold 9px monospace';
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(width - textWidth - 25, y - 8, textWidth + 12, 16);
    ctx.fillStyle = '#0b0e14';
    ctx.fillText(label, width - textWidth - 19, y + 4);
  };

  drawLevelLine(target2, '#06b6d4', `T2 (+${target2Percent}%): ₹${target2.toFixed(1)}`);
  drawLevelLine(target1, '#10b981', `T1 (+${target1Percent}%): ₹${target1.toFixed(1)}`);
  drawLevelLine(entryPrice, '#f59e0b', `ENTRY: ₹${entryPrice.toFixed(1)}`);
  drawLevelLine(stopLoss, '#f43f5e', `SL (-${stopLossPercent}%): ₹${stopLoss.toFixed(1)}`);
}
