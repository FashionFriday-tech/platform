export type NotificationCategory = 'all' | 'orders' | 'inventory' | 'customers' | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  category: 'orders' | 'inventory' | 'customers' | 'system';
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface SendNotificationPayload {
  title: string;
  message: string;
  type?: 'promo' | 'order' | 'announcement' | 'system';
  target: 'ALL' | 'CUSTOMERS' | 'ADMIN' | string;
  userId?: string | null;
  targetUserName?: string | null;
  linkUrl?: string | null;
  badge?: string | null;
  sendPush?: boolean;
}

export interface TargetUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

