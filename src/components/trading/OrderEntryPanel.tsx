'use client';

import React, { useState, useEffect } from 'react';
import { TradeSetup } from '@/types/trading.types';
import { Send, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';

interface OrderEntryPanelProps {
  activeSetup?: TradeSetup | null;
  symbol: string;
}

export const OrderEntryPanel: React.FC<OrderEntryPanelProps> = ({
  activeSetup,
  symbol,
}) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [qty, setQty] = useState(100);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('LIMIT');
  const [price, setPrice] = useState(982.5);
  const [stopLoss, setStopLoss] = useState<number | ''>(972.0);
  const [target, setTarget] = useState<number | ''>(998.0);
  const [submitted, setSubmitted] = useState(false);

  // Sync state if an active setup is provided
  useEffect(() => {
    if (activeSetup) {
      setSide(activeSetup.direction);
      setPrice(activeSetup.entryPrice);
      setStopLoss(activeSetup.stopLoss);
      setTarget(activeSetup.target1);
    }
  }, [activeSetup]);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 3500);
  };

  const marginRequired = Math.round((qty * price) / 5); // 5x intraday margin

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Intraday Order Engine ({symbol})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Risk Gate: ACTIVE
        </span>
      </div>

      {submitted && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Order submitted: {side} {qty} {symbol} @ ₹{price} (SL: ₹{stopLoss}, TGT: ₹{target})</span>
        </div>
      )}

      {/* Side Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSide('BUY')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            side === 'BUY'
              ? 'bg-[#00c087] text-black shadow-lg shadow-emerald-600/30'
              : 'bg-[#0b0e14] text-slate-400 border border-[#232936]'
          }`}
        >
          BUY (LONG)
        </button>
        <button
          type="button"
          onClick={() => setSide('SELL')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            side === 'SELL'
              ? 'bg-[#ff3b69] text-white shadow-lg shadow-rose-600/30'
              : 'bg-[#0b0e14] text-slate-400 border border-[#232936]'
          }`}
        >
          SELL (SHORT)
        </button>
      </div>

      {/* Inputs: Quantity & Order Type */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
            className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="LIMIT">Limit</option>
            <option value="MARKET">Market</option>
          </select>
        </div>
      </div>

      {/* Inputs: Limit Price, Stop Loss, Target */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Price (₹)</label>
          <input
            type="number"
            step="0.05"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl px-2.5 py-2 text-amber-300 font-mono text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-rose-400 mb-1">Stop Loss (₹)</label>
          <input
            type="number"
            step="0.05"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full bg-[#0b0e14] border border-rose-900/40 rounded-xl px-2.5 py-2 text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-emerald-400 mb-1">Target (₹)</label>
          <input
            type="number"
            step="0.05"
            value={target}
            onChange={(e) => setTarget(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full bg-[#0b0e14] border border-emerald-900/40 rounded-xl px-2.5 py-2 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Margin & Sizing Summary */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0b0e14] border border-[#232936] rounded-xl text-[11px] font-mono">
        <span className="text-slate-400 flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-blue-400" /> Approx. Margin (5x):
        </span>
        <span className="font-bold text-white">₹{marginRequired.toLocaleString()}</span>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleExecute}
        className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg ${
          side === 'BUY'
            ? 'bg-[#00c087] hover:bg-emerald-400 text-black shadow-emerald-500/20'
            : 'bg-[#ff3b69] hover:bg-rose-500 text-white shadow-rose-500/20'
        }`}
      >
        Submit {side} Order ({symbol})
      </button>
    </div>
  );
};
