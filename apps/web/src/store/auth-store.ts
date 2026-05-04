import { create } from 'zustand';
import {
  getMeAction,
  logoutAction,
  updateProfileAction,
  deleteAccountAction,
} from '@/features/auth/services/auth.actions';

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
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (
    data: Partial<{ name: string; email: string; phone: string; avatarUrl: string }>,
  ) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  refreshUser: async () => {
    try {
      const data = await getMeAction();
      set({ user: data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: (userData: User) => {
    set({ user: userData, loading: false });
  },

  logout: async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null });
    }
  },

  updateProfile: async (data) => {
    try {
      const updatedUser = await updateProfileAction(data);
      if (updatedUser) {
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      await deleteAccountAction();
      set({ user: null });
    } catch (error) {
      console.error('API account deletion failed:', error);
      throw error;
    }
  },
}));
