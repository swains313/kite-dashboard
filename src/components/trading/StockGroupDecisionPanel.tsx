'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, X, ArrowRight } from 'lucide-react';

interface StockGroupDecisionPanelProps {
  currentSymbol: string;
  currentPrice?: number;
  currentDirection?: 'BUY' | 'HOLD' | 'SELL' | 'NEUTRAL';
  onSelectStock: (symbol: string) => void;
  isLoading: boolean;
}

export const StockGroupDecisionPanel: React.FC<StockGroupDecisionPanelProps> = ({
  currentSymbol,
  currentPrice,
  currentDirection,
  onSelectStock,
  isLoading,
}) => {
  const [stocks, setStocks] = useState<string[]>([
    'MEESHO',
    'RELIANCE',
    'TATAMOTORS',
    'HDFCBANK',
    'INFY',
  ]);
  const [newTicker, setNewTicker] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vertex_stock_group');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStocks(parsed);
        }
      }
    } catch {}
  }, []);

  const saveGroup = (newList: string[]) => {
    setStocks(newList);
    try {
      localStorage.setItem('vertex_stock_group', JSON.stringify(newList));
    } catch {}
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTicker.trim().toUpperCase();
    if (!clean || stocks.includes(clean)) return;
    const updated = [...stocks, clean];
    saveGroup(updated);
    setNewTicker('');
    onSelectStock(clean);
  };

  const handleRemove = (sym: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = stocks.filter((s) => s !== sym);
    saveGroup(updated);
  };

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-4 shadow-xl space-y-3">
      {/* Header & Add Stock Form */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Portfolio & Watchlist Decision Engine
          </h3>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Add NSE Symbol (e.g. ITC)"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            className="bg-[#0b0e14] border border-[#232936] focus:border-blue-500 text-white text-xs font-mono px-2.5 py-1 rounded-lg outline-none w-36 uppercase"
          />
          <button
            type="submit"
            disabled={!newTicker.trim() || isLoading}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {stocks.map((sym) => {
          const isActive = sym.toUpperCase() === currentSymbol.toUpperCase();

          // Decision for active stock based on Minervini SEPA
          let verdictText = 'CHECK ACTION';
          let verdictColor = 'bg-slate-800/60 text-slate-400 border-slate-700/60';
          if (isActive && currentDirection) {
            if (currentDirection === 'BUY') {
              verdictText = '🟢 BUY / BREAKOUT';
              verdictColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            } else if (currentDirection === 'HOLD') {
              verdictText = '🔵 HOLD (STRENGTH)';
              verdictColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
            } else if (currentDirection === 'SELL') {
              verdictText = '🔴 SELL / EXIT';
              verdictColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
            } else {
              verdictText = '🟡 WAIT / TRIGGER';
              verdictColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            }
          }

          return (
            <div
              key={sym}
              onClick={() => onSelectStock(sym)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                isActive
                  ? 'bg-[#0f172a] border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                  : 'bg-[#0b0e14] border-[#232936] hover:border-slate-700 hover:bg-[#111622]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-white">{sym}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(sym, e)}
                  className="text-slate-600 hover:text-rose-400 p-0.5 rounded transition-colors"
                  title="Remove from group"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {isActive && currentPrice ? (
                <div className="font-mono text-xs font-bold text-slate-200">
                  ₹{currentPrice.toFixed(2)}
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  Load Chart <ArrowRight className="w-2.5 h-2.5" />
                </span>
              )}

              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border text-center block uppercase ${verdictColor}`}
              >
                {verdictText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
