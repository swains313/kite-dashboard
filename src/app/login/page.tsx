'use client';

import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
