'use client';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

export function useSettingsFlow() {
  const router = useRouter();
  const { user, logout, deleteAccount } = useAuth();
  const { settings, updateSettings } = useSettings();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promos: true,
  });

  const scrollLevel = settings.autoScrollLevel;
  const speedLabels = ['Lvl 1', 'Lvl 2', 'Lvl 3', 'Lvl 4', 'Lvl 5'];

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  }, [logout]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Deletion error:', error);
      toast.error('Failed to delete account');
      setIsDeleting(false);
    }
  }, [deleteAccount]);

  const handleToggleNotification = useCallback((key: 'orders' | 'promos') => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleUpdateScrollLevel = useCallback(
    (level: number) => {
      updateSettings({
        autoScrollLevel: level,
      });
    },
    [updateSettings],
  );

  const initials = useMemo(() => {
    if (!user) {
      return 'G';
    }
    if (!user.name) {
      return 'U';
    }
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  return {
    router,
    user,
    isDeleting,
    showDeleteModal,
    setShowDeleteModal,
    notifications,
    scrollLevel,
    speedLabels,
    handleLogout,
    handleDeleteAccount,
    handleToggleNotification,
    handleUpdateScrollLevel,
    initials,
  };
}

