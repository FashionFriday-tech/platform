'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'SUPER_ADMIN' | 'PRODUCT_MANAGER' | 'SALES_MANAGER';

export interface User {
  name: string;
  role: Role;
  initials: string;
}

interface AuthContextType {
  user: User;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: 'Jimmy Sullivan',
    role: 'SUPER_ADMIN',
    initials: 'JS',
  });

  const setRole = (role: Role) => {
    setUser((prev) => ({ ...prev, role }));
  };

  return (
    <AuthContext.Provider value={{ user, setRole }}>
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
