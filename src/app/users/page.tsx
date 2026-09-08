'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserStatsCards } from '@/components/users/UserStatsCards';
import { UserTable } from '@/components/users/UserTable';
import { CreateUserModal } from '@/components/users/CreateUserModal';
import { ManagedUser } from '@/types/user.types';
import { Users, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <UserStatsCards users={users} />

          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <UserTable
            users={users}
            loading={loading}
            onDeactivate={handleDeactivate}
          />
        </main>

        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchUsers}
          token={token}
          coreApiUrl={coreApiUrl}
        />
      </div>
    </ProtectedRoute>
  );
}
