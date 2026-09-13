import { MinerviniAnalysis } from './ai.types';

export interface KiteApiOrderPayload {
  tradingsymbol: string;
  exchange: 'NSE';
  transaction_type: 'BUY';
  order_type: 'LIMIT' | 'SL-M';
  quantity: number;
  price: number;
  trigger_price: number;
  product: 'CNC' | 'MIS';
  validity: 'DAY';
  disclosed_quantity?: number;
  tag?: string;
}

export interface TomorrowSwingPlan {
  entryPivot: number;
  entryRange: string;
  stopLoss: number;
  stopLossPercent: number;
  target1: number;
  target1Percent: number;
  target2: number;
  target2Percent: number;
  riskReward: string;
  holdingPeriod: string;
  executionInstructions: string;
}

export interface TopSwingCandidate {
  rank: number;
  symbol: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  swingConvictionScore: number;
  minervini: MinerviniAnalysis;
  newsSentiment: {
    score: number;
    label: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    catalystType: string;
    headlines: string[];
  };
  tomorrowPlan: TomorrowSwingPlan;
  sepaThesis: string;
  kiteApiReady: KiteApiOrderPayload;
}

export interface PostMarketAnalysisResponse {
  timestamp: string;
  isWithinWindow: boolean;
  windowStatus: string;
  totalAnalyzed: number;
  top5Candidates: TopSwingCandidate[];
  allRankedCandidates: TopSwingCandidate[];
}
