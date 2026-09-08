'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  permissions: string[];
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  hasRole: (role: 'admin' | 'user') => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const coreApiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const savedToken = localStorage.getItem('kite_token');
    const savedUser = localStorage.getItem('kite_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify token in background
        fetch(`${coreApiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Token expired');
          })
          .then((verifiedUser) => {
            setUser(verifiedUser);
            localStorage.setItem('kite_user', JSON.stringify(verifiedUser));
          })
          .catch(() => {
            logout();
          })
          .finally(() => setIsLoading(false));
      } catch (e) {
        logout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [coreApiUrl]);

  const login = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('kite_token', newToken);
    localStorage.setItem('kite_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kite_token');
    localStorage.removeItem('kite_user');
  };

  const hasRole = (role: 'admin' | 'user'): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
