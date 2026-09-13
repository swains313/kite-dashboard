'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PostMarketAnalysisResponse } from '@/types/analyzer.types';
import { TopSwingCard } from '@/components/trading/TopSwingCard';
import { ArrowLeft, BarChart3, Clock, RefreshCw, Zap, Shield, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnalyzerPage() {
  const [data, setData] = useState<PostMarketAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [forceOverride, setForceOverride] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/analyzer/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
      } else {
        setError(json.message || 'Outside 4:00 PM – 10:00 PM post-market window.');
      }
    } catch {
      setError('Failed to fetch post-market swing analysis.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleLoop = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analyzer/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ running: !data?.isLoopRunning }),
      });
      if (res.ok) {
        const json = await res.json();
        if (data) {
          setData({ ...data, isLoopRunning: json.isLoopRunning });
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchAnalysis(forceOverride);
    // Poll analyzer status every 15s to keep candidates & loop status synchronized
    const timer = setInterval(() => {
      fetchAnalysis(forceOverride);
    }, 15000);
    return () => clearInterval(timer);
  }, [fetchAnalysis, forceOverride]);

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-16 selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[#07090e]/90 backdrop-blur-md border-b border-[#1b2230] px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111622] hover:bg-[#1a2234] border border-[#232d42] text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Console</span>
            </Link>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  Post-Market Swing Analyzer (4:00 PM – 10:00 PM IST)
                </h1>
                <p className="text-[11px] text-slate-400 font-mono">
                  MARK MINERVINI SEPA® • VCP BREAKOUTS • 5-DAY SWING TARGETS • KITE API READY
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={forceOverride}
                onChange={(e) => setForceOverride(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <span>Test Override</span>
            </label>

            {/* Event Loop Toggle Button */}
            <button
              type="button"
              onClick={handleToggleLoop}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition ${
                data?.isLoopRunning
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${data?.isLoopRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{data?.isLoopRunning ? 'EVENT-LOOP ACTIVE (15m)' : 'LOOP PAUSED'}</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => fetchAnalysis(forceOverride)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Scanning...' : 'Analyze Now'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Status Info Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900/40 to-emerald-950/20 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Tomorrow&apos;s High-Conviction Swing Setup Filter
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  {data?.windowStatus || 'Active 4:00 PM – 10:00 PM IST'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Evaluates entire market session closing prints using Mark Minervini&apos;s SEPA methodology (Stage 2 Uptrend, 8/8 Trend Template, RS Ranking vs Nifty 50, and VCP contraction). Combined with Google News sentiment to deliver the Top 5 candidates for tomorrow.
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-slate-400 shrink-0">
            <span>Analyzed: </span>
            <span className="text-white font-bold">{data?.totalAnalyzed || 0} stocks</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Top 5 Minervini Swing Candidates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Top 5 Swing Stocks for Tomorrow / Next 5 Days:
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Ranked by Minervini SEPA Conviction & News Catalysts
            </span>
          </div>

          {loading && !data ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs bg-[#111622] rounded-2xl border border-[#232d42]">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
              Scanning 28+ liquid NSE equities, computing Minervini 8-point trend templates and Nifty RS rankings...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.top5Candidates.map((cand) => (
                <TopSwingCard key={cand.symbol} candidate={cand} />
              ))}
            </div>
          )}
        </div>

        {/* All Evaluated Candidates Table */}
        {data && data.allRankedCandidates.length > 5 && (
          <div className="space-y-2 pt-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Complete Market Universe Ranking ({data.allRankedCandidates.length} Equities):
            </h3>
            <div className="bg-[#111622] border border-[#232d42] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#232d42] text-slate-400 bg-[#0b0e14]">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">LTP</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3">Trend Template</th>
                    <th className="p-3">RS Rank</th>
                    <th className="p-3">VCP</th>
                    <th className="p-3">SEPA Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d2537]">
                  {data.allRankedCandidates.slice(5).map((c) => (
                    <tr key={c.symbol} className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-500 font-bold">#{c.rank}</td>
                      <td className="p-3 font-bold text-white">{c.symbol}</td>
                      <td className="p-3 text-slate-300">₹{c.currentPrice.toFixed(1)}</td>
                      <td className="p-3 text-emerald-300">{c.minervini.stageLabel}</td>
                      <td className="p-3 text-cyan-300">{c.minervini.trendTemplate.passCount}/8</td>
                      <td className="p-3 text-amber-300">{c.minervini.rsRanking}/99</td>
                      <td className="p-3 text-slate-400">{c.minervini.vcp.detected ? 'DETECTED' : 'NONE'}</td>
                      <td className="p-3 font-bold text-emerald-400">{c.swingConvictionScore.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
