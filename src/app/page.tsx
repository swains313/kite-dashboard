'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, RefreshCw, Cpu, ShieldCheck, Database, Layers, Users, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { SystemOverviewHealth } from '@/modules/health/health.model';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [data, setData] = useState<SystemOverviewHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const { user, isAuthenticated, logout } = useAuth();

  const fetchHealthOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health?overview=true', { cache: 'no-store' });
      if (res.ok) {
        const json: SystemOverviewHealth = await res.json();
        setData(json);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch system overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthOverview();
    const interval = setInterval(fetchHealthOverview, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0e14] text-slate-200">
      {/* Top Navigation */}
      <header className="border-b border-[#232936] bg-[#151922]/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
              K
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">
                Zerodha Kite Autonomous Engine
              </h1>
              <p className="text-xs text-slate-400">Microservice Topology & Health Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-[#0b0e14] border border-[#232936] px-3 py-1.5 rounded-lg text-xs">
                  <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-medium text-white">{user.username}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                    {user.role}
                  </span>
                </div>

                {user.role === 'admin' && (
                  <Link
                    href="/users"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#232936] hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    Operators
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#232936] hover:bg-rose-900/40 text-xs font-medium text-slate-300 hover:text-rose-300 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Operator Login
              </Link>
            )}

            <button
              onClick={fetchHealthOverview}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#232936] hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Architecture Banner */}
        <section className="bg-gradient-to-r from-blue-950/40 via-[#151922] to-[#151922] border border-blue-900/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" /> Multi-Repository High-Throughput Topology
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Clean 3-Repository Algorithmic Trading Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Zero monolithic debt. The core engine ingests binary ticks and enforces hard risk gates, 
            the Python microservice classifies setups via XGBoost, and this Next.js dashboard visualizes 
            real-time positions and asynchronous Gemini AI thesis explanations.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#0b0e14]/60 border border-[#232936] p-3 rounded-lg">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Kite Tick Ingestion
              </div>
              <div className="text-sm font-semibold text-slate-100 mt-1">Binary Ring Buffer</div>
            </div>
            <div className="bg-[#0b0e14]/60 border border-[#232936] p-3 rounded-lg">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Risk Engine
              </div>
              <div className="text-sm font-semibold text-slate-100 mt-1">1% Cap & Kill Switch</div>
            </div>
            <div className="bg-[#0b0e14]/60 border border-[#232936] p-3 rounded-lg">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> ML Inferences
              </div>
              <div className="text-sm font-semibold text-slate-100 mt-1">FastAPI + XGBoost</div>
            </div>
            <div className="bg-[#0b0e14]/60 border border-[#232936] p-3 rounded-lg">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" /> Storage
              </div>
              <div className="text-sm font-semibold text-slate-100 mt-1">TimescaleDB + Redis</div>
            </div>
          </div>
        </section>

        {/* Microservice Live Status Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">Active Microservices Status</h3>
            <span className="text-xs text-slate-400">Auto-refreshing every 10s</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dashboard Card */}
            <ServiceCard
              title="kite-dashboard"
              description="Real-Time UI Client & Visualizer"
              techStack="Next.js 15, TypeScript, Tailwind"
              status={{
                name: 'kite-dashboard',
                url: '/api/health',
                status: data?.dashboard?.status === 'healthy' ? 'healthy' : 'healthy',
                latencyMs: 1,
              }}
            />

            {/* Core Engine Card */}
            <ServiceCard
              title="kite-core-engine"
              description="WebSocket Ingestion & Risk Gate"
              techStack="TypeScript, Node.js, Fastify"
              status={
                data?.services.coreEngine || {
                  name: 'kite-core-engine',
                  url: 'http://localhost:8000/health',
                  status: 'checking',
                }
              }
            />

            {/* ML Service Card */}
            <ServiceCard
              title="kite-ml-service"
              description="XGBoost Inferences & Probability"
              techStack="Python 3.12, FastAPI, Pydantic"
              status={
                data?.services.mlService || {
                  name: 'kite-ml-service',
                  url: 'http://localhost:8001/health',
                  status: 'checking',
                }
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}
