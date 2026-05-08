'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'SALES_MANAGER';

export interface User {
  name: string;
  role: Role;
  initials: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User;
  setRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: 'Jimmy Sullivan',
    role: 'SUPER_ADMIN',
    initials: 'JS',
    phone: '+1 (555) 123-4567',
  });

  const setRole = (role: Role) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
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
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setRole, updateUser }}>
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
