'use client';

import React, { useState } from 'react';
import { Search, Sparkles, Loader2, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface QuerySearchBarProps {
  onSearch: (query: string, tradeType: 'INTRADAY' | 'SWING') => void;
  isLoading: boolean;
  activeTradeType: 'INTRADAY' | 'SWING';
  onTradeTypeChange: (type: 'INTRADAY' | 'SWING') => void;
}

const INTRADAY_PROMPTS = [
  "Today's best stock to buy (Intraday)",
  'Top morning breakout setup',
  'High volume momentum pick',
  'Best banking sector intraday stock',
  'Tech sector intraday pullback bounce',
];

const SWING_PROMPTS = [
  'Best swing trade setup for this week',
  'High-conviction 20 EMA pullback swing',
  'Top breakout stock for 3-5 days holding',
  'Best banking sector swing trade',
  'Heavyweight swing reversal candidate',
];

export const QuerySearchBar: React.FC<QuerySearchBarProps> = ({
  onSearch,
  isLoading,
  activeTradeType,
  onTradeTypeChange,
}) => {
  const [query, setQuery] = useState(
    activeTradeType === 'INTRADAY'
      ? "Today's best stock to buy (Intraday)"
      : 'Best swing trade setup for this week'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim(), activeTradeType);
  };

  const handleSelectPrompt = (prompt: string) => {
    setQuery(prompt);
    onSearch(prompt, activeTradeType);
  };

  const handleToggleType = (type: 'INTRADAY' | 'SWING') => {
    onTradeTypeChange(type);
    const newQuery =
      type === 'INTRADAY'
        ? "Today's best stock to buy (Intraday)"
        : 'Best swing trade setup for this week';
    setQuery(newQuery);
    onSearch(newQuery, type);
  };

  const prompts = activeTradeType === 'INTRADAY' ? INTRADAY_PROMPTS : SWING_PROMPTS;

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header with Trade Mode Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Ask Multi-AI Market Intelligence
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            Real Live NSE Feed
          </span>
        </div>

        {/* Intraday vs Swing Toggle */}
        <div className="flex items-center gap-1 bg-[#0b0e14] border border-[#232936] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleToggleType('INTRADAY')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTradeType === 'INTRADAY'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-300" />
            INTRADAY
          </button>
          <button
            type="button"
            onClick={() => handleToggleType('SWING')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTradeType === 'SWING'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3 h-3 text-purple-300" />
            SWING (2-5D)
          </button>
        </div>
      </div>

      {/* Query Search Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTradeType === 'INTRADAY'
                ? "Ask: Today's best stock to buy, morning breakout, etc."
                : 'Ask: Best swing trade setup, 20 EMA bounce, etc.'
            }
            className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
            </>
          ) : (
            <>
              Ask AI <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Prompts Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] text-slate-400 font-medium">Quick Setups:</span>
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSelectPrompt(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-[#0b0e14] border border-[#232936] hover:border-blue-500/50 text-[11px] font-mono text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
