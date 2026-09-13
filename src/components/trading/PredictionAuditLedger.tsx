import React, { useState } from 'react';
import { PredictionAuditRecord } from '@/types/analyzer.types';
import { ShieldCheck, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, Target, Layers } from 'lucide-react';

interface Props {
  logs: PredictionAuditRecord[];
  onVerify: () => void;
  isVerifying: boolean;
}

export const PredictionAuditLedger: React.FC<Props> = ({ logs, onVerify, isVerifying }) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  return (
    <div className="bg-[#111622] border border-[#232d42] rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b2230] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Multi-Algorithm Prediction Audit & Post-Mortem Ledger
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {logs.length} AUDITED
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              LEVEL-BY-LEVEL ALGORITHM LOGS • ROOT-CAUSE FLAW DETECTION • HISTORICAL VALIDATION
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isVerifying || logs.length === 0}
          onClick={onVerify}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition disabled:opacity-40"
        >
          {isVerifying ? 'Verifying Market Outcomes...' : 'Run Flaw Post-Mortem'}
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="p-6 text-center text-xs font-mono text-slate-500 bg-[#0b0e14] rounded-xl border border-[#1b2230]">
          No audited predictions recorded yet. Run the Post-Market Swing Analyzer to begin generating audit logs.
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {logs.map((log) => {
            const isExpanded = expandedLogId === log.logId;
            return (
              <div
                key={log.logId}
                className="bg-[#0b0e14] border border-[#1b2230] hover:border-slate-700 rounded-xl p-3.5 transition-all text-xs font-mono"
              >
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedLogId(isExpanded ? null : log.logId)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.outcomeStatus === 'SUCCESS_TARGET2'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : log.outcomeStatus === 'SUCCESS_TARGET1'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : log.outcomeStatus === 'STOPPED_OUT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {log.outcomeStatus}
                    </span>

                    <span className="font-bold text-white text-sm">{log.symbol}</span>
                    <span className="text-slate-400">
                      Entry: ₹{log.entryPivot} • SL: ₹{log.stopLoss} • T1: ₹{log.target1}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">{log.swingConvictionScore.toFixed(1)}%</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Flaw Diagnosis Banner if Stopped Out */}
                {log.outcomeStatus === 'STOPPED_OUT' && log.actualOutcome?.flawedAlgorithm && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-200 text-[11px] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        Root-Cause Flaw Identified: {log.actualOutcome.flawedAlgorithm}
                      </span>
                      <span className="text-rose-300 font-sans">{log.actualOutcome.rootCauseAnalysis}</span>
                    </div>
                  </div>
                )}

                {/* Expanded Multi-Level Diagnostic Grid */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#1b2230] space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      Algorithm-by-Algorithm Decision Breakdown:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {log.diagnostics.map((d, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#111622] border border-[#232d42]">
                          <span className="text-[9px] text-slate-400 block truncate">{d.algoName}</span>
                          <span className="font-bold text-white block mt-0.5 text-[11px]">{d.verdict}</span>
                          <span className="text-[9px] text-slate-500 block truncate">{d.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
