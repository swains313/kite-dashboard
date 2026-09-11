export type TradeAction = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED_PROFIT' | 'CLOSED_LOSS' | 'CLOSED_SIGNAL';
export type ExitReason =
  | 'TARGET_1_HIT'
  | 'TARGET_2_HIT'
  | 'STOP_LOSS_HIT'
  | 'MODEL_SELL_SIGNAL'
  | 'MANUAL_SQUARE_OFF';

export interface AutoTrade {
  tradeId: string;
  symbol: string;
  action: TradeAction;
  price: number;
  quantity: number;
  orderType: 'MARKET';
  status: TradeStatus;
  stopLoss: number;
  target1: number;
  target2: number;
  exitPrice?: number;
  realizedPnL?: number;
  realizedPnLPercent?: number;
  exitReason?: ExitReason;
  modelConfidence?: number;
  modelThesis?: string;
  entryTime: string;
  exitTime?: string;
}

export interface AutoTraderStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalRealizedPnL: number;
  maxProfit: number;
  maxLoss: number;
  buyCount?: number;
  sellCount?: number;
}

export interface ActivePosition {
  tradeId: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  stopLoss: number;
  target1: number;
  target2: number;
  entryTime: string;
  modelConfidence: number;
}

export interface AutoTraderState {
  isRunning: boolean;
  targetSymbol: string;
  intervalSeconds: number;
  allocatedCapital: number;
  activePosition: ActivePosition | null;
  stats: AutoTraderStats;
  lastEvaluatedAt: string;
  lastSignal?: string;
  lastEvaluationNote?: string;
  recentTrades?: AutoTrade[];
}

export interface AutoTraderApiResponse {
  success: boolean;
  message?: string;
  data: AutoTraderState;
}
