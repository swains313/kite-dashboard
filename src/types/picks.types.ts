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
  /** 1 = highest conviction of the day's five. */
  rank: number;
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

  /** Market regime this pick was taken in — needed to read the outcome. */
  marketBias?: 'RISK_ON' | 'NEUTRAL' | 'RISK_OFF';
  marketBiasScore?: number;
  marketSummary?: string;
  tradingAdvised?: boolean;

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

export interface Headline {
  title: string;
  source: string;
  publishedAt: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  weight: number;
}

export interface MarketContext {
  timestamp: string;
  biasScore: number;
  bias: 'RISK_ON' | 'NEUTRAL' | 'RISK_OFF';
  indexAboveSMA50: boolean;
  niftyChangePercent: number;
  globalCues: { label: string; changePercent: number; contribution: number }[];
  news: {
    score: number;
    label: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    articleCount: number;
    hasCatalyst: boolean;
    catalystType: string;
    headlines: Headline[];
  };
  summary: string;
  tradingAdvised: boolean;
}

export interface TodayResponse {
  success: boolean;
  tradingDate: string;
  phase: string;
  kite: KiteStatus;
  context: MarketContext | null;
  picks: DailyPick[];
  openPositions: PaperPosition[];
  performance: PerformanceSnapshot[];
}

export interface ChartBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20: number | null;
  sma50: number | null;
}

export interface ChartData {
  symbol: string;
  source: string;
  lastPrice: number;
  changePercent: number;
  bars: ChartBar[];
  sma50: number;
  sma200: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

export interface HoldAdvice {
  symbol: string;
  verdict: 'HOLD' | 'TRIM' | 'EXIT' | 'ADD';
  confidence: number;
  currentPrice: number;
  entryPrice: number;
  unrealizedPercent: number;
  suggestedStop: number;
  reasons: string[];
  warnings: string[];
  summary: string;
  chart: ChartData;
}

export interface DailyAccuracy {
  tradingDate: string;
  mode: TradeMode;
  picksPublished: number;
  triggered: number;
  targetsHit: number;
  stoppedOut: number;
  unresolved: number;
  hitRate: number;
  avgMovePercent: number;
  bestSymbol: string;
  bestMovePercent: number;
  worstSymbol: string;
  worstMovePercent: number;
  marketBias?: string;
  diagnosis: string;
  verdict: 'GOOD' | 'MIXED' | 'POOR' | 'NO_TRADE_DAY';
}

export interface RollingDiagnosis {
  daysAssessed: number;
  avgHitRate: number;
  avgMovePercent: number;
  goodDays: number;
  poorDays: number;
  reading: string;
}
