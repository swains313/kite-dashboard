'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const TABS = [
  { href: '/', label: 'Picks' },
  { href: '/charts', label: 'Charts' },
  { href: '/accuracy', label: 'Accuracy' },
  { href: '/history', label: 'History' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = (user?.username || user?.email || 'A')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-[#0b0e14]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500/15 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/25">
              K
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-100">Kite Engine</span>
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? 'bg-slate-800 font-medium text-slate-100'
                      : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 transition hover:bg-slate-900"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300 ring-1 ring-slate-700">
              {initials}
            </span>
            <span className="hidden text-sm text-slate-400 sm:inline">
              {user?.username || user?.email?.split('@')[0] || 'Account'}
            </span>
          </button>

          {open && (
            <>
              {/* Click-away layer, so the menu closes without a document listener. */}
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
                <div className="border-b border-slate-800 px-3 py-2.5">
                  <div className="truncate text-sm font-medium text-slate-200">
                    {user?.username || 'Account'}
                  </div>
                  <div className="truncate text-xs text-slate-500">{user?.email || 'not signed in'}</div>
                  {user?.role && (
                    <span className="mt-1.5 inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                      {user.role}
                    </span>
                  )}
                </div>
                <Link
                  href="/users"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                >
                  Users
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-rose-400 transition hover:bg-slate-800"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
