'use client';

import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

export type Role = 'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'SALES_MANAGER';

export interface User {
  name: string;
  role: Role;
  initials: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'ff_admin_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = React.useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('ff_admin_pin_unlocked');
    }
  }, []);

  const login = React.useCallback((newUser: User) => {
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    }
  }, []);

  // Helper to verify user against database team roster
  const verifySessionWithServer = React.useCallback(
    async (candidateUser: User): Promise<boolean> => {
      const cleanPhone = candidateUser.phone?.replace(/\D/g, '').slice(-10);

      // Legacy mock admin names or test numbers must be instantly purged
      const isMockName = [
        'sarah chen',
        'marcus johnson',
        'emma williams',
        'jimmy sullivan',
      ].includes(candidateUser.name?.toLowerCase()?.trim());
      const isMockPhone = [
        '9876543210',
        '9876543211',
        '9876543212',
        '8888888888',
        '7777777777',
      ].includes(cleanPhone || '');
      if (isMockName || isMockPhone) {
        logout();
        return false;
      }

      // Super Admin 7558969093 is always valid
      if (cleanPhone === '7558969093' && candidateUser.role === 'SUPER_ADMIN') {
        return true;
      }

      // Any other team member must exist in the database with status ACTIVE
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const res = await fetch(`${apiUrl}/admin/team`);
        if (res.ok) {
          const team = (await res.json()) as {
            phone?: string;
            role?: Role;
            status?: string;
            name?: string;
          }[];
          if (Array.isArray(team)) {
            const matched = team.find(
              (m) => m.phone?.replace(/\D/g, '').slice(-10) === cleanPhone && m.status === 'ACTIVE',
            );
            if (!matched) {
              // User was deleted/removed from database! Force logout immediately.
              logout();
              return false;
            }
            return true;
          }
        }
      } catch {
        // Fallback for offline conditions
        try {
          const storedInvited = localStorage.getItem('ff_admin_invited_team');
          if (storedInvited) {
            const list = JSON.parse(storedInvited) as { phone?: string }[];
            const exists = list.some((m) => m.phone?.replace(/\D/g, '').endsWith(cleanPhone || ''));
            if (!exists) {
              logout();
              return false;
            }
          }
        } catch {
          // ignore
        }
      }
      return true;
    },
    [logout],
  );

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as User;
          const isValid = await verifySessionWithServer(parsed);
          if (isValid) {
            setUser(parsed);
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
          logout();
        }
      }
      setIsLoading(false);
    };

    void initAuth();
  }, [verifySessionWithServer, logout]);

  // Periodic heartbeat & window focus check: verify active user hasn't been deleted from database
  useEffect(() => {
    if (!user) {
      return;
    }
    const cleanPhone = user.phone?.replace(/\D/g, '').slice(-10);
    if (cleanPhone === '7558969093') {
      return;
    }

    const interval = setInterval(async () => {
      const isValid = await verifySessionWithServer(user);
      if (!isValid) {
        logout();
      }
    }, 15000);

    const handleFocus = async () => {
      const isValid = await verifySessionWithServer(user);
      if (!isValid) {
        logout();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, verifySessionWithServer, logout]);

  const setRole = (role: Role) => {
    setUser((prev) => {
      if (!prev) {
        return null;
      }
      const updated = { ...prev, role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) {
        return null;
      }
      const updated = { ...prev, ...updates };
      if (updates.name && updates.name !== prev.name) {
        const parts = updates.name.split(' ').filter(Boolean);
        if (parts.length >= 2) {
          updated.initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length === 1) {
          updated.initials = parts[0].substring(0, 2).toUpperCase();
        } else {
          updated.initials = '';
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
