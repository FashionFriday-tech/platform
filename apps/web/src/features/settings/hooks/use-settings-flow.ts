'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';

export function useSettingsFlow() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const syncSettings = useSettingsStore((state) => state.syncSettings);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    syncSettings();
  }, [syncSettings]);

  const notifications = settings.notifications ?? {
    orders: true,
    promos: true,
  };

  const scrollLevel = settings.autoScrollLevel ?? 3;
  const speedLabels = ['Lvl 1', 'Lvl 2', 'Lvl 3', 'Lvl 4', 'Lvl 5'];

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.replace('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  }, [logout, router]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      router.replace('/');
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Deletion error:', error);
      toast.error('Failed to delete account');
      setIsDeleting(false);
    }
  }, [deleteAccount, router]);

  const handleToggleNotification = useCallback(
    (key: 'orders' | 'promos') => {
      const current = settings.notifications ?? { orders: true, promos: true };
      const updated = {
        ...current,
        [key]: !current[key],
      };
      updateSettings({
        notifications: updated,
      });
      toast.success(
        updated[key]
          ? `${key === 'orders' ? 'Order Logistics' : 'Exclusive Drops'} alerts enabled`
          : `${key === 'orders' ? 'Order Logistics' : 'Exclusive Drops'} alerts muted`,
      );
    },
    [settings.notifications, updateSettings],
  );

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
