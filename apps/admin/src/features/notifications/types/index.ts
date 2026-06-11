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
