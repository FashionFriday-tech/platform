'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { authApi } from '@/lib/api-client';

interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  loyaltyPoints?: number;
  accountStatus?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    await Promise.resolve();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await authApi.getMe();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Only clear if it's a definitive auth error (non-network)
      // The interceptor will handle token refresh, so if we reach here, it failed.
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, []);

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    setLoading(false);
    router.replace('/account');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.replace('/');
    }
  };

  const updateProfile = async (data: any) => {
    const updatedUser = await authApi.updateProfile(data);
    setUser(updatedUser);
  };

  const deleteAccount = async () => {
    try {
      await authApi.deleteAccount();
    } catch (error) {
      console.error('API account deletion failed:', error);
      // We still proceed to logout the user locally if the API fails,
      // or we can choose to re-throw if the user MUST know it didn't delete on DB.
      // For now, let's re-throw so the Settings page can show the toast error.
      throw error;
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.replace('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser, updateProfile, deleteAccount }}
    >
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
