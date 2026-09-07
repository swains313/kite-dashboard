import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { ServiceHealthStatus } from '@/modules/health/health.model';

interface ServiceCardProps {
  title: string;
  description: string;
  status: ServiceHealthStatus;
  techStack: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  status,
  techStack,
}) => {
  const getStatusBadge = () => {
    switch (status.status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Degraded
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Offline / Disconnected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            Checking...
          </span>
        );
    }
  };

  return (
    <div className="bg-[#151922] border border-[#232936] rounded-xl p-6 shadow-xl transition-all duration-200 hover:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-3 pt-3 border-t border-[#232936] text-xs">
        <div className="flex justify-between items-center text-slate-400">
          <span>Endpoint:</span>
          <span className="font-mono text-slate-200 bg-[#0b0e14] px-2 py-0.5 rounded border border-[#232936]">
            {status.url}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-400">
          <span>Tech Stack:</span>
          <span className="text-slate-300 font-medium">{techStack}</span>
        </div>

        {status.latencyMs !== undefined && (
          <div className="flex justify-between items-center text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> Latency:
            </span>
            <span className="font-mono text-emerald-400">{status.latencyMs}ms</span>
          </div>
        )}

        {status.error && (
          <div className="mt-2 p-2.5 bg-rose-950/40 border border-rose-800/40 rounded text-rose-300 font-mono text-[11px] break-all">
            {status.error}
          </div>
        )}
      </div>
    </div>
  );
};
