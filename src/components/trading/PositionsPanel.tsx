'use client';

import React, { useState } from 'react';
import { Position } from '@/types/trading.types';
import { Briefcase, XCircle } from 'lucide-react';

export const PositionsPanel: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([
    { symbol: 'TATAMOTORS', type: 'BUY', qty: 150, avgPrice: 978.5, ltp: 984.2, pnl: +855.0, stopLoss: 970.0, target: 998.0 },
    { symbol: 'RELIANCE', type: 'BUY', qty: 50, avgPrice: 2970.0, ltp: 2985.5, pnl: +775.0, stopLoss: 2950.0, target: 3030.0 },
  ]);

  const handleClose = (symbol: string) => {
    setPositions((prev) => prev.filter((p) => p.symbol !== symbol));
  };

  const totalPnl = positions.reduce((acc, p) => acc + p.pnl, 0);

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Live Intraday Positions ({positions.length})</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Total P&L:</span>
          <span className={`font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnl >= 0 ? `+₹${totalPnl.toFixed(2)}` : `-₹${Math.abs(totalPnl).toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-[#232936] pb-2 font-medium">
              <th className="pb-2">Symbol</th>
              <th className="pb-2">Side</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Avg</th>
              <th className="pb-2">LTP</th>
              <th className="pb-2 text-rose-400">Stop Loss</th>
              <th className="pb-2 text-emerald-400">Target</th>
              <th className="pb-2 text-right">P&L</th>
              <th className="pb-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232936]">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-slate-500 font-mono text-xs">
                  No active intraday positions open.
                </td>
              </tr>
            ) : (
              positions.map((p) => (
                <tr key={p.symbol} className="hover:bg-[#1a202c]/40 font-mono text-[11px]">
                  <td className="py-2.5 font-bold text-white">{p.symbol}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        p.type === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {p.type}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-300">{p.qty}</td>
                  <td className="py-2.5 text-slate-400">₹{p.avgPrice.toFixed(1)}</td>
                  <td className="py-2.5 text-slate-200">₹{p.ltp.toFixed(1)}</td>
                  <td className="py-2.5 text-rose-400">₹{p.stopLoss?.toFixed(1) ?? '—'}</td>
                  <td className="py-2.5 text-emerald-400">₹{p.target?.toFixed(1) ?? '—'}</td>
                  <td className={`py-2.5 text-right font-bold ${p.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {p.pnl >= 0 ? `+₹${p.pnl.toFixed(1)}` : `-₹${Math.abs(p.pnl).toFixed(1)}`}
                  </td>
                  <td className="py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleClose(p.symbol)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                      title="Square off position"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
