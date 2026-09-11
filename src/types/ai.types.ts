export type Timeframe = '1M' | '5M' | '15M' | '1D';

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
  ema9: number;
  ema20: number;
}

export interface XGBoostPrediction {
  modelName: string;
  probability: number;
  signal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'AVOID' | 'SELL';
  confidenceTier: string;
  keyDrivers: {
    orderFlowImbalance: number;
    volumeSurgeRatio: number;
    volatilityExpansion: number;
  };
}

export interface GeminiPrediction {
  modelName: string;
  marketThesis: string;
  sectorSentiment: string;
  macroFactors: string;
  riskEvaluation: string;
  executionAdvice: string;
}

export interface TrendTemplateCriteria {
  priceAbove150MA: boolean;
  priceAbove200MA: boolean;
  ma150AboveMA200: boolean;
  ma200TrendingUp: boolean;
  ma50Above150Above200: boolean;
  priceAbove50MA: boolean;
  above30PctFrom52wLow: boolean;
  within25PctOf52wHigh: boolean;
  allPassed: boolean;
  passCount: number;
}

export interface VCPResult {
  detected: boolean;
  contractionCount: number;
  pullbackPercentages: number[];
  volumeDryUp: boolean;
  pivotPrice: number;
  breakoutProximityPercent: number;
  quality: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
}

export interface MinerviniAnalysis {
  trendTemplate: TrendTemplateCriteria;
  stage: 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'STAGE_4';
  stageLabel: string;
  rsRanking: number;
  vcp: VCPResult;
  sma50: number;
  sma150: number;
  sma200: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  pctAbove52wLow: number;
  pctBelow52wHigh: number;
  minerviniVerdict: 'BUY' | 'HOLD' | 'SELL';
  verdictReason: string;
}

export interface QuantitativePrediction {
  modelName: string;
  vwapStatus: 'ABOVE' | 'BELOW';
  emaAlignment: 'BULLISH' | 'BEARISH';
  rsiValue: number;
  atrValue: number;
  supportLevel: number;
  resistanceLevel: number;
  minervini?: MinerviniAnalysis;
}

export interface CandidateStock {
  symbol: string;
  name: string;
  targetPercent: number;
  reason: string;
}

export interface NewsArticle {
  title: string;
  source: string;
  publishedTime: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impact: string;
}

export interface MediaSentiment {
  sentimentScore: number;
  sentimentLabel: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  catalystType: string;
  summary: string;
  news: NewsArticle[];
}

export interface MultiLayerConfluence {
  technicalLayer: string;
  historicalLayer: string;
  newsMediaLayer: string;
  compositeVerdict: string;
}

export interface AIPredictionResponse {
  query: string;
  timestamp: string;
  symbol: string;
  companyName: string;
  currentPrice: number;
  direction: 'BUY' | 'HOLD' | 'SELL' | 'NEUTRAL';
  tradeType: 'INTRADAY' | 'SWING';
  holdingPeriod: string;
  buyTime: string;
  entryPrice: number;
  entryRange: string;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;
  target1Percent: number;
  target2: number;
  target2Percent: number;
  riskReward: string;
  candles: CandlePoint[];
  candidates?: CandidateStock[];
  mediaSentiment?: MediaSentiment;
  multiLayerConfluence?: MultiLayerConfluence;
  aiPredictions: {
    xgboost: XGBoostPrediction;
    gemini: GeminiPrediction;
    quantitative: QuantitativePrediction;
  };
}

export interface HighConvictionScanItem {
  symbol: string;
  companyName: string;
  price: number;
  convictionPercent: number;
  signal: 'STRONG_BUY' | 'BUY';
  vwap: number;
  vwapStatus: 'ABOVE';
  emaAlignment: 'BULLISH';
  rsiValue: number;
  volumeSurgeRatio: number;
  orderFlowImbalance: number;
  matchedStates: string[];
  entryPrice: number;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;
  target1Percent: number;
  target2: number;
  target2Percent: number;
  riskReward: string;
  buyTimeWindow: string;
  convictionThesis: string;
  minervini?: MinerviniAnalysis;
}

export interface MarketScanResponse {
  timestamp: string;
  tradeType: 'INTRADAY' | 'SWING';
  totalAnalyzed: number;
  qualifyingCount: number;
  setups: HighConvictionScanItem[];
}
