'use client';

import React from 'react';
import { Users, ShieldCheck, UserCheck } from 'lucide-react';
import { ManagedUser } from '@/types/user.types';

interface UserStatsCardsProps {
  users: ManagedUser[];
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users }) => {
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const traderCount = users.filter((u) => u.role === 'user').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-[#151922] border border-[#232936] rounded-xl p-5 shadow-lg">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-400" /> Total Operators
        </div>
        <div className="text-2xl font-bold text-white mt-2 font-mono">{totalUsers}</div>
      </div>

      <div className="bg-[#151922] border border-[#232936] rounded-xl p-5 shadow-lg">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> System Administrators
        </div>
        <div className="text-2xl font-bold text-white mt-2 font-mono">{adminCount}</div>
      </div>

      <div className="bg-[#151922] border border-[#232936] rounded-xl p-5 shadow-lg">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-400" /> Standard Traders
        </div>
        <div className="text-2xl font-bold text-white mt-2 font-mono">{traderCount}</div>
      </div>
    </div>
  );
};
