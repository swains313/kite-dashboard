'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { QuerySearchBar } from '@/components/trading/QuerySearchBar';
import { StockGroupDecisionPanel } from '@/components/trading/StockGroupDecisionPanel';
import { DynamicStockChart } from '@/components/trading/DynamicStockChart';
import { TradeLevelsBanner } from '@/components/trading/TradeLevelsBanner';
import { PositionSizeCalculator } from '@/components/trading/PositionSizeCalculator';
import { TopCandidatesStrip } from '@/components/trading/TopCandidatesStrip';
import { MediaSentimentCard } from '@/components/trading/MediaSentimentCard';
import { AIModelCards } from '@/components/trading/AIModelCards';
import { AIPredictionResponse, Timeframe } from '@/types/ai.types';
import { Users, LogOut, User as UserIcon, Activity, AlertCircle, Zap, Bot } from 'lucide-react';

export default function Home() {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const [prediction, setPrediction] = useState<AIPredictionResponse | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tradeType, setTradeType] = useState<'INTRADAY' | 'SWING'>('INTRADAY');
  const [currentTimeframe, setCurrentTimeframe] = useState<Timeframe>('5M');

  const coreApiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchPrediction = useCallback(
    async (
      queryText: string,
      timeframe: Timeframe = currentTimeframe,
      type: 'INTRADAY' | 'SWING' = tradeType
    ) => {
      setFetching(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${coreApiUrl}/api/ai/intraday-prediction`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query: queryText, timeframe, tradeType: type }),
        });

        if (!res.ok) {
          // If unauthenticated or offline, fallback to public prediction endpoint
          const publicRes = await fetch(`${coreApiUrl}/api/ai/public-prediction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryText, timeframe, tradeType: type }),
          });
          if (!publicRes.ok) {
            throw new Error('Failed to compute multi-AI prediction');
          }
          const publicData = await publicRes.json();
          setPrediction(publicData);
          return;
        }

        const data = await res.json();
        setPrediction(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching AI prediction');
      } finally {
        setFetching(false);
      }
    },
    [coreApiUrl, token, currentTimeframe, tradeType]
  );

  // Initial load: support ?symbol=XYZ from market scanner
  useEffect(() => {
    if (isAuthenticated) {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const initialSymbol = params?.get('symbol');
      if (initialSymbol) {
        fetchPrediction(`Analyze ${initialSymbol.toUpperCase()} today intraday`, '5M', 'INTRADAY');
      } else {
        fetchPrediction("Today's best stock to buy (Intraday)", '5M', 'INTRADAY');
      }
    }
  }, [isAuthenticated, fetchPrediction]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // By default, if unauthenticated, show secure login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6">
        <LoginForm />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-200 pb-12">
      {/* Top Header Navigation */}
      <header className="border-b border-[#232936] bg-[#151922]/90 backdrop-blur sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                Vertex Intelligence Console
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> MULTI-AI ACTIVE
                </span>
                <span>•</span>
                <span>QUANT + XGBOOST + GEMINI + LIVE FINANCIAL MEDIA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0b0e14] border border-[#232936] px-3 py-1.5 rounded-xl text-xs">
              <UserIcon className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-white">{user?.username}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                  user?.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {user?.role}
              </span>
            </div>

            <Link
              href="/autotrader"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:text-white transition shadow-sm"
              title="Open Autonomous Event-Loop Auto-Trader"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>🤖 Auto-Trader Loop</span>
            </Link>

            <Link
              href="/scanner"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:text-white transition shadow-sm"
              title="Open Institutional 99% AI Market Scanner"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>⚡ 99% AI Market Scanner</span>
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/users"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#232936] hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Operators
              </Link>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#232936] hover:bg-rose-900/40 text-xs font-semibold text-slate-300 hover:text-rose-300 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Natural Language Query Search Bar */}
        <QuerySearchBar
          onSearch={(q, type) => {
            setTradeType(type);
            fetchPrediction(q, currentTimeframe, type);
          }}
          isLoading={fetching}
          activeTradeType={tradeType}
          onTradeTypeChange={(t) => {
            setTradeType(t);
            setCurrentTimeframe(t === 'INTRADAY' ? '5M' : '1D');
          }}
        />

        {/* Portfolio & Watchlist Group Decision Engine */}
        <StockGroupDecisionPanel
          currentSymbol={prediction ? prediction.symbol : ''}
          currentPrice={prediction ? prediction.currentPrice : undefined}
          currentDirection={prediction ? prediction.direction : undefined}
          onSelectStock={(sym) => fetchPrediction(sym, currentTimeframe, tradeType)}
          isLoading={fetching}
        />

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {prediction && (
          <>
            {/* Top 3 AI Candidates Strip */}
            <TopCandidatesStrip
              currentSymbol={prediction.symbol}
              candidates={prediction.candidates}
              onSelectStock={(sym) => fetchPrediction(sym, currentTimeframe, tradeType)}
              isLoading={fetching}
            />

            {/* The Chart Segment (ALWAYS VISIBLE) */}
            <DynamicStockChart
              symbol={prediction.symbol}
              companyName={prediction.companyName}
              currentPrice={prediction.currentPrice}
              direction={prediction.direction}
              buyTime={prediction.buyTime}
              entryPrice={prediction.entryPrice}
              stopLoss={prediction.stopLoss}
              stopLossPercent={prediction.stopLossPercent}
              target1={prediction.target1}
              target1Percent={prediction.target1Percent}
              target2={prediction.target2}
              target2Percent={prediction.target2Percent}
              candles={prediction.candles}
              onTimeframeChange={(tf) => {
                setCurrentTimeframe(tf);
                fetchPrediction(prediction.query, tf, tradeType);
              }}
            />

            {/* Trade Parameters Banner: Buy Time, SL, Target */}
            <TradeLevelsBanner
              symbol={prediction.symbol}
              companyName={prediction.companyName}
              direction={prediction.direction}
              tradeType={prediction.tradeType || tradeType}
              holdingPeriod={prediction.holdingPeriod}
              buyTime={prediction.buyTime}
              entryPrice={prediction.entryPrice}
              entryRange={prediction.entryRange}
              stopLoss={prediction.stopLoss}
              stopLossPercent={prediction.stopLossPercent}
              target1={prediction.target1}
              target1Percent={prediction.target1Percent}
              target2={prediction.target2}
              target2Percent={prediction.target2Percent}
              riskReward={prediction.riskReward}
            />

            {/* Position Sizer & Capital Risk Model */}
            <PositionSizeCalculator
              entryPrice={prediction.entryPrice}
              stopLoss={prediction.stopLoss}
              target1={prediction.target1}
              target2={prediction.target2}
              tradeType={prediction.tradeType || tradeType}
            />

            {/* Multi-Layer Confluence & Live Financial Media Intelligence */}
            <MediaSentimentCard
              mediaSentiment={prediction.mediaSentiment}
              multiLayerConfluence={prediction.multiLayerConfluence}
              symbol={prediction.symbol}
            />

            {/* Predictions for EACH AI Model */}
            <AIModelCards
              xgboost={prediction.aiPredictions.xgboost}
              gemini={prediction.aiPredictions.gemini}
              quantitative={prediction.aiPredictions.quantitative}
            />
          </>
        )}
      </div>
    </main>
  );
}
