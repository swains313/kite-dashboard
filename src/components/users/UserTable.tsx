'use client';

import React from 'react';
import { ShieldCheck, User as UserIcon, Loader2 } from 'lucide-react';
import { ManagedUser } from '@/types/user.types';

interface UserTableProps {
  users: ManagedUser[];
  loading: boolean;
  onDeactivate: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, loading, onDeactivate }) => {
  return (
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
                      onClick={() => onDeactivate(u.id)}
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
  );
};
