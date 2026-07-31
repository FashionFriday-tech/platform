export type TabType = 'all' | 'orders' | 'promo';

export interface Notification {
  id: string;
  type: 'order' | 'promo';
  title: string;
  message: string;
  timestamp: string;
  createdAt: string;
  link?: string;
  isRead?: boolean;
  orderNumber?: string;
  orderStatus?: string;
  badge?: string;
}
