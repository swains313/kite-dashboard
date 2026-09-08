'use client';

import React, { useState } from 'react';
import { Send, Shield } from 'lucide-react';

export const OrderEntryPanel: React.FC = () => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [qty, setQty] = useState(75);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Fast Order Execution</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
          <Shield className="w-3 h-3" /> Risk Gate: ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSide('BUY')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${side === 'BUY' ? 'bg-[#00c087] text-black shadow-lg shadow-emerald-600/30' : 'bg-[#0b0e14] text-slate-400 border border-[#232936]'}`}
        >
          BUY (LONG)
        </button>
        <button
          type="button"
          onClick={() => setSide('SELL')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${side === 'SELL' ? 'bg-[#ff3b69] text-white shadow-lg shadow-rose-600/30' : 'bg-[#0b0e14] text-slate-400 border border-[#232936]'}`}
        >
          SELL (SHORT)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Quantity (Lots)</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as any)}
            className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="MARKET">Market</option>
            <option value="LIMIT">Limit</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${side === 'BUY' ? 'bg-[#00c087] hover:bg-emerald-400 text-black shadow-emerald-500/20' : 'bg-[#ff3b69] hover:bg-rose-500 text-white shadow-rose-500/20'}`}
      >
        Execute {side} Order
      </button>
    </div>
  );
};
