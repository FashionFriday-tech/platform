'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

import { type AdminNotification, type SendNotificationPayload } from '../types';

const STORAGE_KEY = 'ff_admin_notifications_cache_v2';
const READ_KEY = 'ff_admin_notifications_read_ids';
const DELETED_KEY = 'ff_admin_notifications_deleted_ids';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AdminNotification[];
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(notifications.length === 0);
  const [isSending, setIsSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  const getReadSet = (): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(READ_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  const getDeletedSet = (): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(DELETED_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  const fetchLiveNotifications = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    try {
      const res = await fetch(`${apiUrl}/admin/notifications`, {
        cache: 'no-store',
        credentials: 'include',
      });

      if (res.ok) {
        const liveItems = (await res.json()) as AdminNotification[];
        if (Array.isArray(liveItems)) {
          const readSet = getReadSet();
          const deletedSet = getDeletedSet();

          const processed = liveItems
            .filter((item) => !deletedSet.has(item.id))
            .map((item) => ({
              ...item,
              read: item.read || readSet.has(item.id),
            }));

          setNotifications(processed);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(processed));
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn('[useNotifications] Live fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    void fetchLiveNotifications();

    // Auto refresh every 20 seconds
    const interval = setInterval(() => {
      void fetchLiveNotifications();
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchLiveNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, read: true } : item));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        const readSet = getReadSet();
        readSet.add(id);
        localStorage.setItem(READ_KEY, JSON.stringify(Array.from(readSet)));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        const readSet = getReadSet();
        updated.forEach((u) => readSet.add(u.id));
        localStorage.setItem(READ_KEY, JSON.stringify(Array.from(readSet)));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    // 1. Optimistic local removal
    setNotifications((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        const deletedSet = getDeletedSet();
        deletedSet.add(id);
        localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deletedSet)));
      } catch {
        // ignore
      }
      return updated;
    });

    // 2. Call backend if custom notification
    if (id.startsWith('notif-custom-')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      try {
        await fetch(`${apiUrl}/admin/notifications/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch {
        // ignore
      }
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications((prev) => {
      try {
        const deletedSet = getDeletedSet();
        prev.forEach((p) => deletedSet.add(p.id));
        localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(deletedSet)));
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      return [];
    });
  }, []);

  const sendNotification = useCallback(
    async (payload: SendNotificationPayload): Promise<{ success: boolean; message?: string }> => {
      setIsSending(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

      try {
        const res = await fetch(`${apiUrl}/admin/notifications/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error('Failed to send notification');
        }

        const data = await res.json();
        // Refresh notifications list to show the sent broadcast immediately
        await fetchLiveNotifications();
        return { success: true };
      } catch (err: any) {
        console.error('[sendNotification] Error:', err);
        return { success: false, message: err.message || 'Failed to dispatch notification' };
      } finally {
        setIsSending(false);
      }
    },
    [fetchLiveNotifications],
  );

  const { user } = useAuth();
  const userRole = user?.role || 'SUPER_ADMIN';

  // Role-based notification filtering:
  const roleFilteredNotifications = useMemo(() => {
    if (userRole === 'PRODUCT_MANAGER') {
      return notifications.filter((n) => n.category === 'inventory');
    }
    if (userRole === 'SALES_MANAGER') {
      return notifications.filter((n) => n.category === 'orders' || n.category === 'customers');
    }
    return notifications;
  }, [notifications, userRole]);

  const addNotification = useCallback((notif: AdminNotification) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notif.id)) return prev;
      const updated = [notif, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const unreadCount = mounted ? roleFilteredNotifications.filter((n) => !n.read).length : 0;

  return {
    notifications: roleFilteredNotifications,
    unreadCount,
    isLoading,
    isSending,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
    sendNotification,
    refresh: fetchLiveNotifications,
  };
}
