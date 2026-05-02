import { create } from 'zustand';
import { authApi } from '@/lib/api-client';

export interface User {
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

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<{ name: string; email: string; phone: string; avatarUrl: string }>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  refreshUser: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    try {
      const data = await authApi.getMe();
      set({ user: data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: (accessToken: string, refreshToken: string, userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({ user: userData, loading: false });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      set({ user: null });
    }
  },

  updateProfile: async (data) => {
    const updatedUser = await authApi.updateProfile(data);
    set({ user: updatedUser });
  },

  deleteAccount: async () => {
    try {
      await authApi.deleteAccount();
    } catch (error) {
      console.error('API account deletion failed:', error);
      throw error;
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      set({ user: null });
    }
  },
}));
