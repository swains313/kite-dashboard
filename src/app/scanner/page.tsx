'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MarketScanResponse, HighConvictionScanItem } from '@/types/ai.types';
import {
  Zap,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Radar,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';

export default function ScannerPage() {
  const { token } = useAuth();
  const [tradeType, setTradeType] = useState<'INTRADAY' | 'SWING'>('INTRADAY');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<MarketScanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const coreApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const runPowerScan = async () => {
    setScanning(true);
    setError(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let res = await fetch(`${coreApiUrl}/api/ai/power-scan`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tradeType }),
      });

      if (!res.ok) {
        res = await fetch(`${coreApiUrl}/api/ai/public-power-scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tradeType }),
        });
      }

      if (!res.ok) throw new Error('Market scanner API returned an error');
      const data = (await res.json()) as MarketScanResponse;
      setScanResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to scan market');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-white hover:border-slate-500 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Main Console
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">
              Vertex Intelligence // High-Conviction Scanner
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex text-xs">
            <button
              onClick={() => setTradeType('INTRADAY')}
              className={`px-3 py-1 rounded font-medium transition ${tradeType === 'INTRADAY' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Intraday (5M)
            </button>
            <button
              onClick={() => setTradeType('SWING')}
              className={`px-3 py-1 rounded font-medium transition ${tradeType === 'SWING' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Swing (1D)
            </button>
          </div>
          <button
            onClick={runPowerScan}
            disabled={scanning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 disabled:opacity-50 transition shadow-lg shadow-cyan-500/20"
          >
            {scanning ? <Radar className="w-4 h-4 animate-spin text-slate-950" /> : <Zap className="w-4 h-4 fill-slate-950" />}
            {scanning ? 'Analyzing Market...' : 'Run 99% AI Market Scanner'}
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <main className="max-w-7xl mx-auto mt-6 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono mb-2">
                <Sparkles className="w-3 h-3" /> ZERO HARDCODING • TODAY&apos;S DYNAMIC MARKET SCAN
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Institutional 90%–99% All-States Buy Scanner
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Dynamically resolves today&apos;s active NSE liquid universe and scans for 100% all-states buy confluence: VWAP support, 9/20 EMA Golden Cross, RSI momentum corridor, Relative Volume expansion, and positive Order Flow Delta accumulation.
              </p>
            </div>
            {scanResult && (
              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl">
                <div className="text-right">
                  <div className="text-[10px] uppercase text-slate-400 font-mono">Universe Evaluated</div>
                  <div className="text-lg font-bold text-slate-200">{scanResult.totalAnalyzed} Stocks</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-right">
                  <div className="text-[10px] uppercase text-emerald-400 font-mono">Qualified (90%-99%)</div>
                  <div className="text-lg font-bold text-emerald-400">{scanResult.qualifyingCount} Setups</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scanning State */}
        {scanning && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
              <Zap className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Scanning dynamic market order flow & technical states...</p>
              <p className="text-xs text-slate-400 mt-1">Applying strict institutional 6-state filter (Price &gt; VWAP, EMA alignment, RSI, Volume Surge)</p>
            </div>
          </div>
        )}

        {/* Scan Results Cards */}
        {!scanning && scanResult && scanResult.setups.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scanResult.setups.map((setup: HighConvictionScanItem) => (
              <div
                key={setup.symbol}
                className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-6 transition-all duration-300 relative group shadow-lg shadow-emerald-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xl font-black tracking-tight text-white">{setup.symbol}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] font-mono tracking-wider">
                          {setup.signal}
                        </span>
                        {setup.minervini && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold text-[10px] font-mono tracking-wider">
                            {setup.minervini.stage} • RS {setup.minervini.rsRanking}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{setup.companyName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white font-mono">₹{setup.price.toFixed(2)}</div>
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 mt-1">
                        <ShieldCheck className="w-3 h-3" /> {setup.convictionPercent.toFixed(1)}% Conviction
                      </div>
                    </div>
                  </div>

                  {/* 100% All-States Verified Badges */}
                  <div className="mt-4">
                    <p className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      100% Institutional Buy Confluence Checklist:
                    </p>
                    <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {setup.matchedStates.map((state, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span>{state}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Execution Plan Grid */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">ENTRY PRICE</span>
                      <span className="text-sm font-bold text-cyan-300 font-mono">₹{setup.entryPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">STOP LOSS</span>
                      <span className="text-sm font-bold text-rose-400 font-mono">₹{setup.stopLoss.toFixed(2)}</span>
                      <span className="text-[10px] text-rose-400 block font-mono">-{setup.stopLossPercent.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">TARGET 1</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">₹{setup.target1.toFixed(2)}</span>
                      <span className="text-[10px] text-emerald-400 block font-mono">+{setup.target1Percent.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">TARGET 2</span>
                      <span className="text-sm font-bold text-emerald-300 font-mono">₹{setup.target2.toFixed(2)}</span>
                      <span className="text-[10px] text-emerald-300 block font-mono">+{setup.target2Percent.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Context Info */}
                  <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-cyan-400" /> R:R: <strong className="text-slate-200">{setup.riskReward}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Window: <strong className="text-slate-200">{setup.buyTimeWindow}</strong>
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
                    {setup.convictionThesis}
                  </p>
                </div>

                {/* Primary Action to Main Console */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end">
                  <Link
                    href={`/?symbol=${setup.symbol}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 font-semibold text-xs tracking-wider uppercase transition"
                  >
                    Trade in Main Chart <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Qualified State */}
        {!scanning && scanResult && scanResult.setups.length === 0 && (
          <div className="py-16 text-center bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-3">
            <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No 90%–99% All-States Confluence Found Today</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Out of {scanResult.totalAnalyzed} market candidates analyzed, none satisfied 100% of all 6 institutional criteria (Price &gt; VWAP, Golden Cross, Momentum RSI, Volume surge &gt;1.2x, positive order flow delta). Capital preservation is maintained.
            </p>
          </div>
        )}

        {/* Initial Prompt State */}
        {!scanning && !scanResult && (
          <div className="py-16 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 space-y-4">
            <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto opacity-70" />
            <h3 className="text-base font-semibold text-slate-200">Ready to Scan Today&apos;s Market</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click the button above to dynamically discover active symbols in today&apos;s session and filter for 90%–99% intraday buy conviction.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
