export type Timeframe = '1M' | '5M' | '15M' | '1D';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeSetup {
  id: string;
  symbol: string;
  companyName: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  entryRange: string;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;
  target1Percent: number;
  target2: number;
  target2Percent: number;
  riskReward: string;
  confidenceScore: number;
  rationale: string;
  indicators: {
    vwap: 'ABOVE' | 'BELOW';
    emaCross: 'BULLISH' | 'BEARISH';
    relativeVolume: string;
    rsi: number;
  };
}

export interface Position {
  symbol: string;
  type: 'BUY' | 'SELL';
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  stopLoss?: number;
  target?: number;
}

export interface OrderInput {
  symbol: string;
  side: 'BUY' | 'SELL';
  qty: number;
  price?: number;
  stopLoss?: number;
  target?: number;
  orderType: 'MARKET' | 'LIMIT';
}
