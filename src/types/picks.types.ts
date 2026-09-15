export type TradeMode = 'INTRADAY' | 'SWING';

export type PickGrade = 'A_GRADE' | 'B_GRADE' | 'NO_TRADE_QUALITY';

export type PickOutcome =
  | 'PENDING'
  | 'NOT_TRIGGERED'
  | 'TARGET_1_HIT'
  | 'TARGET_2_HIT'
  | 'STOP_LOSS_HIT'
  | 'TIME_EXIT'
  | 'SQUARED_OFF';

export interface PickFactors {
  minerviniStage: string;
  trendTemplatePassCount: number;
  rsRanking: number;
  vcpDetected: boolean;
  vcpQuality: string;
  volumeZScore: number;
  isPocketPivot: boolean;
  volatilitySqueezeRatio: number;
  isVolatilityCompressed: boolean;
  mansfieldRelativeStrength: number;
  patternDtwScore: number;
  pointOfControl: number;
  lowVolumeNodeBreakout: boolean;
  newsSentimentScore: number;
  atr14: number;
  avgVolume20: number;
}

export interface DailyPick {
  _id: string;
  tradingDate: string;
  mode: TradeMode;
  symbol: string;
  companyName: string;
  grade: PickGrade;
  convictionScore: number;

  referencePrice: number;
  entryTrigger: number;
  entryRangeLow: number;
  entryRangeHigh: number;
  stopLoss: number;
  target1: number;
  target2: number;
  stopLossPercent: number;
  target1Percent: number;
  target2Percent: number;
  riskRewardT1: number;

  suggestedQuantity: number;
  capitalDeployed: number;
  riskAmount: number;

  holdingPeriod: string;
  thesis: string;
  factors: PickFactors;

  dataSource: 'KITE' | 'YAHOO';
  candidatesEvaluated: number;
  runnersUp: { symbol: string; convictionScore: number; grade: PickGrade }[];

  outcome: PickOutcome;
  outcomeNote?: string;
  exitPrice?: number;
  realizedPnL?: number;
  realizedRMultiple?: number;
}

export interface PaperPosition {
  positionId: string;
  symbol: string;
  mode: TradeMode;
  entryPrice: number;
  quantity: number;
  lastPrice: number;
  stopLoss: number;
  target1: number;
  unrealizedPnL: number;
}

export interface PerformanceSnapshot {
  mode: TradeMode | 'ALL';
  grade: PickGrade | 'ALL';
  totalPicks: number;
  wins: number;
  losses: number;
  winRate: number;
  avgRMultiple: number;
  totalNetPnL: number;
  profitFactor: number;
}

export interface KiteStatus {
  configured: boolean;
  authenticated: boolean;
  tokenDate: string;
  historicalEnabled: boolean;
  loginUrl: string | null;
}

export interface TodayResponse {
  success: boolean;
  tradingDate: string;
  phase: string;
  kite: KiteStatus;
  picks: DailyPick[];
  openPositions: PaperPosition[];
  performance: PerformanceSnapshot[];
}
