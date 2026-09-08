'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { TradingChart } from '@/components/trading/TradingChart';
import { IntradayPickCard } from '@/components/trading/IntradayPickCard';
import { PositionsPanel } from '@/components/trading/PositionsPanel';
import { OrderEntryPanel } from '@/components/trading/OrderEntryPanel';
import { TradeSetup } from '@/types/trading.types';
import { Users, LogOut, User as UserIcon, Activity } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('TATAMOTORS');
  const [activeSetup, setActiveSetup] = useState<TradeSetup | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // By default, if unauthenticated, show secure login without exposing any internal topology
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6">
        <LoginForm />
      </div>
    );
  }

  const handleSelectSetup = (setup: TradeSetup) => {
    setSelectedSymbol(setup.symbol);
    setActiveSetup(setup);
  };

  const handlePrefillOrder = (setup: TradeSetup) => {
    setSelectedSymbol(setup.symbol);
    setActiveSetup(setup);
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-200">
      {/* Top Trading Navigation */}
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE STREAM
                </span>
                <span>•</span>
                <span>HIGH-THROUGHPUT METRIC PROCESSING</span>
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

      {/* Multi-Card Trading Cockpit View */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Row 1: Interactive Chart + Today's Best Stock Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TradingChart
              symbol={selectedSymbol}
              onSymbolChange={setSelectedSymbol}
              activeSetup={activeSetup}
            />
          </div>

          <div className="lg:col-span-1">
            <IntradayPickCard
              onSelectSetup={handleSelectSetup}
              onPrefillOrder={handlePrefillOrder}
              activeSetupId={activeSetup?.id}
            />
          </div>
        </div>

        {/* Row 2: Live Positions + Fast Order Execution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PositionsPanel />
          </div>

          <div className="lg:col-span-1">
            <OrderEntryPanel
              symbol={selectedSymbol}
              activeSetup={activeSetup}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
