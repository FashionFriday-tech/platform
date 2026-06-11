'use client';

import { useCallback, useEffect, useState } from 'react';

import { type AdminNotification } from '../types';

const STORAGE_KEY = 'ff_admin_notifications';

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'New Customer Order Placed',
    description:
      'Order #ORD-1002 has been received from Sarah Jenkins (Total: ₹4,899). Ready for confirmation.',
    category: 'orders',
    priority: 'high',
    timestamp: '10 minutes ago',
    read: false,
    actionUrl: '/orders',
    actionLabel: 'View Order',
  },
  {
    id: 'notif-2',
    title: 'Prepaid Payment Received',
    description: 'Payment of ₹4,899 for order #ORD-1002 was verified via Razorpay.',
    category: 'orders',
    priority: 'medium',
    timestamp: '25 minutes ago',
    read: false,
    actionUrl: '/orders',
    actionLabel: 'Review Payment',
  },
  {
    id: 'notif-3',
    title: 'Low Stock Alert: Silk Shirt',
    description:
      'Classic Silk Shirt (SKU: FFS-091) has reached low stock threshold (3 units remaining).',
    category: 'inventory',
    priority: 'high',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/products',
    actionLabel: 'Manage Stock',
  },
  {
    id: 'notif-4',
    title: 'New Customer Registered',
    description: 'A new user Rahul Verma registered with phone number +91 98765 43210.',
    category: 'customers',
    priority: 'low',
    timestamp: '5 hours ago',
    read: true,
    actionUrl: '/customers',
    actionLabel: 'View Customer',
  },
  {
    id: 'notif-5',
    title: 'New 5-Star Review Submitted',
    description:
      'Priya Sharma left a 5-star review on Oversized Denim Jacket: "Outstanding fabric quality!".',
    category: 'customers',
    priority: 'medium',
    timestamp: 'Yesterday at 3:45 PM',
    read: true,
    actionUrl: '/reviews',
    actionLabel: 'View Review',
  },
  {
    id: 'notif-6',
    title: 'System Database Backup Completed',
    description: 'Automated nightly database backup and media CDN sync completed successfully.',
    category: 'system',
    priority: 'low',
    timestamp: 'Yesterday at 2:00 AM',
    read: true,
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(DEFAULT_NOTIFICATIONS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdminNotification[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      }
    } catch {
      // ignore storage parsing error
    }
  }, []);

  const saveNotifications = useCallback(
    (updater: (prev: AdminNotification[]) => AdminNotification[]) => {
      setNotifications((prev) => {
        const updated = updater(prev);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [],
  );

  const markAsRead = useCallback(
    (id: string) => {
      saveNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
    },
    [saveNotifications],
  );

  const markAllAsRead = useCallback(() => {
    saveNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, [saveNotifications]);

  const deleteNotification = useCallback(
    (id: string) => {
      saveNotifications((prev) => prev.filter((item) => item.id !== id));
    },
    [saveNotifications],
  );

  const clearAll = useCallback(() => {
    saveNotifications(() => []);
  }, [saveNotifications]);

  const unreadCount = mounted ? notifications.filter((n) => !n.read).length : 2;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}
