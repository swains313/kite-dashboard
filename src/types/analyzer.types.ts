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
  advancedQuant?: {
    volumeZScore: number;
    isPocketPivot: boolean;
    volatilitySqueezeRatio: number;
    isVolatilityCompressed: boolean;
    mansfieldRelativeStrength: number;
    patternDtwScore: number;
    pointOfControl: number;
    lowVolumeNodeBreakout: boolean;
  };
  kiteApiReady: KiteApiOrderPayload;
}

export interface PostMarketAnalysisResponse {
  timestamp: string;
  isWithinWindow: boolean;
  windowStatus: string;
  isLoopRunning: boolean;
  loopIntervalSeconds: number;
  nextRunInSeconds?: number;
  totalAnalyzed: number;
  top5Candidates: TopSwingCandidate[];
  allRankedCandidates: TopSwingCandidate[];
}

export interface AlgoDiagnostic {
  algoName: string;
  verdict: string;
  score: number;
  details: string;
}

export interface PredictionAuditRecord {
  logId: string;
  timestamp: string;
  symbol: string;
  companyName: string;
  predictedPrice: number;
  entryPivot: number;
  stopLoss: number;
  target1: number;
  target2: number;
  swingConvictionScore: number;
  minerviniStage: string;
  rsRanking: number;
  vcpDetected: boolean;
  pocketPivot: boolean;
  atrSqueeze: number;
  mansfieldRS: number;
  dtwScore: number;
  newsSentiment: string;
  diagnostics: AlgoDiagnostic[];
  outcomeStatus: 'PENDING' | 'SUCCESS_TARGET1' | 'SUCCESS_TARGET2' | 'STOPPED_OUT' | 'FLAW_IDENTIFIED';
  actualOutcome?: {
    highestPriceReached?: number;
    lowestPriceReached?: number;
    closingPriceDay5?: number;
    realizedReturnPercent?: number;
    flawedAlgorithm?: string;
    rootCauseAnalysis?: string;
    verifiedAt?: string;
  };
}
