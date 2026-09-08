'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  ArrowLeft,
  X,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
} from 'lucide-react';

interface ManagedUser {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const coreApiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${coreApiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      setUsers(data.users || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error loading users');
    } finally {
      setLoading(false);
    }
  }, [coreApiUrl, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch(`${coreApiUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, username, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      setIsModalOpen(false);
      setEmail('');
      setUsername('');
      setPassword('');
      fetchUsers();
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : 'Creation failed');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this operator?')) return;
    try {
      const res = await fetch(`${coreApiUrl}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#0b0e14] text-slate-200">
        {/* Navigation Bar */}
        <header className="border-b border-[#232936] bg-[#151922]/80 backdrop-blur sticky top-0 z-40 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg bg-[#0b0e14] border border-[#232936] hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Operator Management & RBAC
                </h1>
                <p className="text-xs text-slate-400">Manage trading accounts, roles, and granular permissions</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              New Operator
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#151922] border border-[#232936] rounded-xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> Total Operators
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">{users.length}</div>
            </div>

            <div className="bg-[#151922] border border-[#232936] rounded-xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> System Administrators
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">
                {users.filter((u) => u.role === 'admin').length}
              </div>
            </div>

            <div className="bg-[#151922] border border-[#232936] rounded-xl p-5 shadow-lg">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" /> Standard Traders
              </div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">
                {users.filter((u) => u.role === 'user').length}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* User Table */}
          <div className="bg-[#151922] border border-[#232936] rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0b0e14] border-b border-[#232936] text-slate-400">
                    <th className="py-3 px-4 font-semibold">Operator</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Capabilities</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Created</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232936]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                        Loading database records...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No operators registered.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#1a202c]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{u.username}</div>
                          <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <ShieldCheck className="w-3 h-3" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <UserIcon className="w-3 h-3" /> Trader
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {u.permissions?.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 bg-[#0b0e14] border border-[#232936] rounded font-mono text-[10px] text-slate-300"
                              >
                                {p}
                              </span>
                            ))}
                            {u.permissions?.length > 3 && (
                              <span className="px-1 py-0.5 text-[10px] text-slate-400">
                                +{u.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {u.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Suspended
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeactivate(u.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium"
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Create User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#151922] border border-[#232936] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#232936]">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  Register New Operator
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@company.com"
                      className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="trader_john"
                      className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Role Assignment</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                    className="w-full bg-[#0b0e14] border border-[#232936] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="user">Trader (Standard Access)</option>
                    <option value="admin">Administrator (Full Control)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#232936]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#0b0e14] border border-[#232936] hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {modalSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Operator'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
