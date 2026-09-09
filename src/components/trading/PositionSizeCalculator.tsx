'use client';

import React, { useState } from 'react';
import { Calculator, ShieldAlert, Target, Wallet, Percent, ArrowUpRight } from 'lucide-react';

interface PositionSizeCalculatorProps {
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  tradeType: 'INTRADAY' | 'SWING';
}

export const PositionSizeCalculator: React.FC<PositionSizeCalculatorProps> = ({
  entryPrice,
  stopLoss,
  target1,
  target2,
  tradeType,
}) => {
  const [capital, setCapital] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [useLeverage, setUseLeverage] = useState<boolean>(tradeType === 'INTRADAY');

  const riskPerShare = Math.max(0.1, Math.abs(entryPrice - stopLoss));
  const maxRupeeRisk = (capital * riskPercent) / 100;
  const recommendedQty = Math.max(1, Math.floor(maxRupeeRisk / riskPerShare));
  const totalPositionValue = Math.round(recommendedQty * entryPrice);
  const leverageMultiplier = useLeverage ? (tradeType === 'INTRADAY' ? 5 : 1) : 1;
  const marginRequired = Math.round(totalPositionValue / leverageMultiplier);

  const potentialLoss = Math.round(recommendedQty * riskPerShare);
  const gainTarget1 = Math.round(recommendedQty * Math.max(0, target1 - entryPrice));
  const gainTarget2 = Math.round(recommendedQty * Math.max(0, target2 - entryPrice));

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232936]">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Position Sizer & Capital Risk Model
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="text-slate-400">Risk Rule:</span>
          <span className="text-emerald-400 font-bold">1% Capital Preservation Rule</span>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Capital Input */}
        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Wallet className="w-3 h-3 text-blue-400" /> Total Account Capital (₹)
          </span>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(Math.max(1000, Number(e.target.value)))}
            step={10000}
            className="w-full bg-transparent font-mono text-base font-bold text-white focus:outline-none"
          />
        </div>

        {/* Risk Percentage Toggle */}
        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Percent className="w-3 h-3 text-amber-400" /> Risk Per Trade
            </span>
            <span className="text-amber-300 font-bold">{riskPercent}%</span>
          </div>
          <div className="flex items-center gap-1">
            {[0.5, 1.0, 1.5, 2.0].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setRiskPercent(pct)}
                className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  riskPercent === pct
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#151922] text-slate-400 hover:text-white border border-[#232936]'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Margin / Leverage Switch */}
        <div className="bg-[#0b0e14] border border-[#232936] p-3 rounded-xl space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono block">Order Product Mode</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setUseLeverage(true)}
              className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                useLeverage
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-[#151922] text-slate-400 hover:text-white border border-[#232936]'
              }`}
            >
              5x MIS (Intraday)
            </button>
            <button
              type="button"
              onClick={() => setUseLeverage(false)}
              className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                !useLeverage
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-[#151922] text-slate-400 hover:text-white border border-[#232936]'
              }`}
            >
              1x CNC (Swing)
            </button>
          </div>
        </div>
      </div>

      {/* Calculated Results Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
        <div className="bg-[#0b0e14] border border-[#232936] p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 block font-mono">Max Qty to Buy</span>
          <span className="font-mono text-base font-extrabold text-blue-400 mt-0.5 block">
            {recommendedQty} <span className="text-[10px] font-normal text-slate-400">shares</span>
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-[#232936] p-2.5 rounded-xl">
          <span className="text-[10px] text-slate-400 block font-mono">Margin Required</span>
          <span className="font-mono text-base font-extrabold text-white mt-0.5 block">
            ₹{marginRequired.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-rose-900/30 p-2.5 rounded-xl bg-rose-950/10">
          <span className="text-[10px] text-rose-300 block font-mono flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Max Risk (SL)
          </span>
          <span className="font-mono text-base font-extrabold text-rose-400 mt-0.5 block">
            -₹{potentialLoss.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-emerald-900/30 p-2.5 rounded-xl bg-emerald-950/10">
          <span className="text-[10px] text-emerald-300 block font-mono flex items-center gap-1">
            <Target className="w-3 h-3" /> Profit Target 1
          </span>
          <span className="font-mono text-base font-extrabold text-emerald-400 mt-0.5 block">
            +₹{gainTarget1.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-[#0b0e14] border border-teal-900/30 p-2.5 rounded-xl bg-teal-950/10 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-teal-300 block font-mono flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Profit Target 2
          </span>
          <span className="font-mono text-base font-extrabold text-teal-400 mt-0.5 block">
            +₹{gainTarget2.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};
