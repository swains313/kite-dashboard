'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Square, Zap, RefreshCw, TrendingUp, TrendingDown, Activity, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { AutoTraderState } from '@/types/autotrader.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const QUICK_STOCKS = ['TATAMOTORS', 'BHARTIARTL', 'RELIANCE', 'ICICIBANK', 'LT', 'BAJFINANCE'];

export const AutoTradingEventLoopPanel: React.FC = () => {
  const [state, setState] = useState<AutoTraderState | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetInput, setTargetInput] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/autotrader/status`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setState(json.data);
          if (!targetInput) setTargetInput(json.data.targetSymbol);
        }
      }
    } catch {}
  }, [targetInput]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleToggle = async (desiredState?: boolean) => {
    setLoading(true);
    try {
      const sym = targetInput.trim().toUpperCase() || state?.targetSymbol || 'TATAMOTORS';
      const res = await fetch(`${API_BASE}/api/autotrader/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ running: desiredState !== undefined ? desiredState : !state?.isRunning, symbol: sym }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setState(json.data);
      }
    } catch {}
    setLoading(false);
  };

  const handleSquareOff = async () => {
    if (!confirm('Square off active auto-trading position at current market price?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/autotrader/square-off`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setState(json.data);
      }
    } catch {}
    setLoading(false);
  };

  const isRunning = !!state?.isRunning;
  const activePos = state?.activePosition;
  const stats = state?.stats || { totalTrades: 0, winningTrades: 0, losingTrades: 0, winRate: 0, totalRealizedPnL: 0 };
  const recentTrades = state?.recentTrades || [];

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Top Header & Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232936]">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${isRunning ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
            <Zap className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Autonomous Event-Loop Trader</h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${isRunning ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800/80 text-slate-400 border-slate-700'}`}>
                {isRunning ? '● LOOP ACTIVE (15s)' : '○ IDLE (STOPPED)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Automated buy/sell model verification engine with MongoDB trade ledger</p>
          </div>
        </div>

        {/* Start / Stop Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleToggle(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-black flex items-center gap-2 transition-all shadow-lg ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20 border border-rose-400/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 border border-emerald-400/40'
            }`}
          >
            {isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isRunning ? 'STOP AUTO-TRADER' : 'START AUTO-TRADER'}
          </button>
        </div>
      </div>

      {/* Target Stock Configuration & Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-[#0b0e14] p-3 rounded-xl border border-[#232936]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11px]">TARGET SYMBOL:</span>
          <input
            type="text"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value.toUpperCase())}
            disabled={isRunning}
            placeholder="e.g. TATAMOTORS"
            className="bg-[#151922] border border-[#232936] text-white px-2.5 py-1 rounded-lg text-xs font-bold w-28 uppercase outline-none focus:border-cyan-500 disabled:opacity-50"
          />
          <div className="flex items-center gap-1 flex-wrap">
            {QUICK_STOCKS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={isRunning}
                onClick={() => setTargetInput(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                  targetInput === s ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                } disabled:opacity-40`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          Last Check: <span className="text-slate-300 font-bold">{state?.lastEvaluatedAt ? new Date(state.lastEvaluatedAt).toLocaleTimeString() : 'Waiting...'}</span>
        </div>
      </div>

      {/* Real-Time Performance Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">TOTAL REALIZED P&L</span>
          <span className={`font-mono font-black text-lg block mt-0.5 ${stats.totalRealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.totalRealizedPnL >= 0 ? '+' : ''}₹{stats.totalRealizedPnL.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">WIN RATE</span>
          <span className="font-mono font-black text-lg text-cyan-300 block mt-0.5">
            {stats.winRate.toFixed(1)}%
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">EXECUTED TRADES</span>
          <span className="font-mono font-bold text-lg text-slate-200 block mt-0.5">
            {stats.totalTrades} <span className="text-[10px] text-slate-400 font-normal">({stats.winningTrades}W / {stats.losingTrades}L)</span>
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl">
          <span className="text-[10px] font-mono text-slate-400 block">LAST SIGNAL</span>
          <span className={`font-mono font-bold text-base block mt-0.5 ${
            state?.lastSignal === 'BUY' ? 'text-emerald-400' : state?.lastSignal === 'SELL' ? 'text-rose-400' : 'text-amber-300'
          }`}>
            {state?.lastSignal || 'NONE'}
          </span>
        </div>
      </div>

      {/* Active Position Live Monitor */}
      {activePos && (
        <div className="bg-[#0b0e14] border border-cyan-500/40 p-4 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                ACTIVE LONG
              </span>
              <span className="font-mono font-black text-sm text-white">{activePos.symbol}</span>
              <span className="text-xs text-slate-400 font-mono">({activePos.quantity} Qty)</span>
            </div>
            <button
              type="button"
              onClick={handleSquareOff}
              className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition-colors"
            >
              Manual Square-Off
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">ENTRY PRICE</span>
              <span className="font-bold text-slate-200">₹{activePos.entryPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">CURRENT LTP</span>
              <span className="font-bold text-white">₹{activePos.currentPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">UNREALIZED P&L</span>
              <span className={`font-bold ${activePos.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activePos.unrealizedPnL >= 0 ? '+' : ''}₹{activePos.unrealizedPnL.toFixed(2)} ({activePos.unrealizedPnLPercent.toFixed(2)}%)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">TARGET 1 / SL</span>
              <span className="text-emerald-300">₹{activePos.target1}</span> / <span className="text-rose-400">₹{activePos.stopLoss}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Auto-Trade History Table */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Automated Execution Log ({recentTrades.length} records):
        </span>
        {recentTrades.length === 0 ? (
          <div className="p-3 text-center text-xs font-mono text-slate-500 bg-[#0b0e14] rounded-xl border border-[#232936]">
            No automated trades executed yet. Start the loop to allow autonomous execution on model triggers.
          </div>
        ) : (
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
            {recentTrades.slice(0, 10).map((t) => (
              <div key={t.tradeId} className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-[#0b0e14] border border-[#232936]/80">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    t.status === 'CLOSED_PROFIT' ? 'bg-emerald-500/20 text-emerald-300' : t.status === 'CLOSED_LOSS' ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {t.status}
                  </span>
                  <span className="font-bold text-white">{t.symbol}</span>
                  <span className="text-slate-400">{t.quantity} shares @ ₹{t.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {t.realizedPnL !== undefined && (
                    <span className={`font-bold ${t.realizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.realizedPnL >= 0 ? '+' : ''}₹{t.realizedPnL.toFixed(2)}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">{t.exitReason || 'OPEN'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
