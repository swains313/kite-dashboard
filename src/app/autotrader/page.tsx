'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AutoTradingEventLoopPanel } from '@/components/trading/AutoTradingEventLoopPanel';
import { ArrowLeft, Bot, Shield, Activity, Sparkles } from 'lucide-react';

export default function AutoTraderPage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-16 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#07090e]/90 backdrop-blur-md border-b border-[#1b2230] px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111622] hover:bg-[#1a2234] border border-[#232d42] text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Console</span>
            </Link>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  Autonomous Auto-Trader Hub
                </h1>
                <p className="text-[11px] text-slate-400 font-mono">
                  15s EVENT-LOOP • MINERVINI SEPA & QUANT SIGNALS • MONGODB AUDIT LEDGER
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EVENT-LOOP ONLINE</span>
            </div>

            <Link
              href="/scanner"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111622] hover:bg-[#1a2234] border border-[#232d42] text-xs font-medium text-slate-300 hover:text-white transition"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scanner</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Info Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/40 to-cyan-950/20 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Automated Model Validation & Trade Execution
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PAPER / LIVE ISOLATED
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                This engine continuously polls live market candles every 15 seconds, passes them through the Mark Minervini SEPA & multi-layer confluence models, and records automated trades in the audit database when signals hit high conviction.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Target: Multi-Symbol Selectable</span>
          </div>
        </div>

        {/* Auto-Trader Panel */}
        <AutoTradingEventLoopPanel />
      </div>
    </main>
  );
}
