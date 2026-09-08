'use client';

import React from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';

interface Position {
  symbol: string;
  type: 'BUY' | 'SELL';
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
}

export const PositionsPanel: React.FC = () => {
  const positions: Position[] = [
    { symbol: 'NIFTY 24400 CE', type: 'BUY', qty: 75, avgPrice: 132.5, ltp: 154.2, pnl: +1627.5 },
    { symbol: 'BANKNIFTY 52100 PE', type: 'SELL', qty: 30, avgPrice: 285.0, ltp: 242.1, pnl: +1287.0 },
  ];

  const totalPnl = positions.reduce((acc, p) => acc + p.pnl, 0);

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Active Positions</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Net P&L:</span>
          <span className={`font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnl >= 0 ? `+₹${totalPnl.toFixed(2)}` : `-₹${Math.abs(totalPnl).toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-[#232936] pb-2 font-medium">
              <th className="pb-2">Instrument</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Avg</th>
              <th className="pb-2">LTP</th>
              <th className="pb-2 text-right">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232936]">
            {positions.map((p) => (
              <tr key={p.symbol} className="hover:bg-[#1a202c]/40 font-mono text-[11px]">
                <td className="py-2.5 font-bold text-white">{p.symbol}</td>
                <td className="py-2.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${p.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {p.type}
                  </span>
                </td>
                <td className="py-2.5 text-slate-300">{p.qty}</td>
                <td className="py-2.5 text-slate-400">₹{p.avgPrice.toFixed(1)}</td>
                <td className="py-2.5 text-slate-200">₹{p.ltp.toFixed(1)}</td>
                <td className={`py-2.5 text-right font-bold ${p.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {p.pnl >= 0 ? `+₹${p.pnl.toFixed(1)}` : `-₹${Math.abs(p.pnl).toFixed(1)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
