'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAuthStore } from '@/store/auth-store';

import {
  getDynamicNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notifications.service';
import { type Notification, type TabType } from '../types';

export function useNotifications(type: TabType = 'all') {
  const user = useAuthStore((state) => state.user);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDynamicNotifications();
      setAllNotifications(data.all);
    } catch (err) {
      console.error('[useNotifications] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications, user?.id]);

  const notifications = allNotifications.filter((n) => {
    if (type === 'all') {
      return true;
    }
    if (type === 'orders') {
      return n.type === 'order';
    }
    if (type === 'promo') {
      return n.type === 'promo';
    }
    return true;
  });

  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const markRead = useCallback((id: string) => {
    markNotificationAsRead(id);
    setAllNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    const ids = allNotifications.map((n) => n.id);
    markAllNotificationsAsRead(ids);
    setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [allNotifications]);

  return {
    notifications,
    allNotifications,
    isLoading,
    unreadCount,
    markRead,
    markAllRead,
    refetch: fetchNotifications,
  };
}
