import { fetchUserOrdersAction } from '@/features/orders/services/orders.actions';

import { type Notification } from '../types';

const READ_STORAGE_KEY = 'ff_read_notifications_v1';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

/**
 * Format timestamp into human-readable relative duration
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 60) {
    return 'JUST NOW';
  }
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'MIN' : 'MINS'} AGO`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'HOUR' : 'HOURS'} AGO`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? 'DAY' : 'DAYS'} AGO`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} ${weeks === 1 ? 'WEEK' : 'WEEKS'} AGO`;
  }
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? 'MONTH' : 'MONTHS'} AGO`;
}

/**
 * Read and persist unread/read state in client storage
 */
export function getReadNotificationIds(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markNotificationAsRead(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const set = getReadNotificationIds();
    set.add(id);
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('[Notifications] Failed to save read state:', err);
  }
}

export function markAllNotificationsAsRead(ids: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const set = getReadNotificationIds();
    ids.forEach((id) => set.add(id));
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('[Notifications] Failed to save read all state:', err);
  }
}

/**
 * Fetch dynamic promotional drop notifications from backend campaigns
 */
async function fetchPromoNotifications(): Promise<Notification[]> {
  const readIds = getReadNotificationIds();

  // Baseline real system drops always present in the platform
  const staticPromos: Notification[] = [
    {
      id: 'promo-weekly-drop',
      type: 'promo',
      title: 'Weekly Friday Drop',
      message: 'New archive collection drops are live. Limited edition sneakers & hype streetwear.',
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(), // 4 hours ago
      timestamp: formatRelativeTime(new Date(Date.now() - 3600 * 1000 * 4).toISOString()),
      link: '/collections/new-arrivals',
      badge: 'DROP LIVE',
      isRead: readIds.has('promo-weekly-drop'),
    },
    {
      id: 'promo-express-cod',
      type: 'promo',
      title: 'Pan-India Express Delivery',
      message: 'Cash on Delivery and express dispatch active across all major Indian cities.',
      createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(), // 1 day ago
      timestamp: formatRelativeTime(new Date(Date.now() - 3600 * 1000 * 28).toISOString()),
      link: '/help/shipping',
      badge: 'BENEFIT',
      isRead: readIds.has('promo-express-cod'),
    },
    {
      id: 'promo-authenticity',
      type: 'promo',
      title: 'Authenticity Guarantee',
      message: 'Every pair of kicks and apparel item undergoes verified physical inspection.',
      createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(), // 3 days ago
      timestamp: formatRelativeTime(new Date(Date.now() - 3600 * 1000 * 72).toISOString()),
      link: '/help/about',
      badge: 'VERIFIED',
      isRead: readIds.has('promo-authenticity'),
    },
  ];

  try {
    const res = await fetch(`${API_URL}/campaigns`, {
      method: 'GET',
      next: { revalidate: 60 },
    }).catch(() => null);

    if (res?.ok) {
      const campaigns = await res.json();
      if (Array.isArray(campaigns) && campaigns.length > 0) {
        const campaignPromos: Notification[] = campaigns
          .filter((c: any) => c.isActive)
          .map((c: any) => ({
            id: `campaign-${c.id}`,
            type: 'promo' as const,
            title: c.title || 'Flash Drop Alert',
            message: 'Exclusive drop alert: explore the latest limited collection.',
            createdAt: c.createdAt || new Date().toISOString(),
            timestamp: formatRelativeTime(c.createdAt || new Date().toISOString()),
            link: c.linkUrl || '/',
            badge: 'CAMPAIGN',
            isRead: readIds.has(`campaign-${c.id}`),
          }));

        return [...campaignPromos, ...staticPromos];
      }
    }
  } catch (err) {
    console.warn('[Notifications] Campaigns fetch fallback:', err);
  }

  return staticPromos;
}

/**
 * Fetch dynamic order status notifications for the current authenticated user
 */
async function fetchOrderNotifications(): Promise<Notification[]> {
  const readIds = getReadNotificationIds();

  try {
    const orders = await fetchUserOrdersAction();

    if (!Array.isArray(orders) || orders.length === 0) {
      return [];
    }

    return orders.map((order: any) => {
      const status = (order.status || 'PENDING').toUpperCase();
      let title = 'Order Update';
      let message = `Status update on order #${order.orderNumber}.`;
      let badge = status;

      switch (status) {
        case 'PENDING':
          title = 'Order Received';
          message = `Your order #${order.orderNumber} has been received and is being processed.`;
          badge = 'PENDING';
          break;
        case 'CONFIRMED':
          title = 'Order Confirmed';
          message = `Payment confirmed for order #${order.orderNumber}. Preparing for dispatch.`;
          badge = 'CONFIRMED';
          break;
        case 'PROCESSING':
          title = 'Packaging Gear';
          message = `Order #${order.orderNumber} is being packed and quality checked at the warehouse.`;
          badge = 'PROCESSING';
          break;
        case 'SHIPPED':
          title = 'Order Shipped';
          message = `Order #${order.orderNumber} has been shipped.${order.trackingNumber ? ` Tracking: #${order.trackingNumber}` : ''}`;
          badge = 'IN TRANSIT';
          break;
        case 'DELIVERED':
          title = 'Order Delivered';
          message = `Package #${order.orderNumber} has been delivered. Enjoy your fresh gear!`;
          badge = 'DELIVERED';
          break;
        case 'CANCELLED':
          title = 'Order Cancelled';
          message = `Order #${order.orderNumber} was cancelled.`;
          badge = 'CANCELLED';
          break;
        case 'REFUNDED':
          title = 'Refund Processed';
          message = `Refund for order #${order.orderNumber} has been processed to your original payment method.`;
          badge = 'REFUNDED';
          break;
      }

      const dateStr = order.updatedAt || order.createdAt || new Date().toISOString();

      return {
        id: `order-${order.id}-${status.toLowerCase()}`,
        type: 'order' as const,
        title,
        message,
        createdAt: dateStr,
        timestamp: formatRelativeTime(dateStr),
        link: '/account/orders',
        orderNumber: order.orderNumber,
        orderStatus: status,
        badge,
        isRead: readIds.has(`order-${order.id}-${status.toLowerCase()}`),
      };
    });
  } catch (err) {
    console.error('[Notifications] Failed to fetch order notifications:', err);
    return [];
  }
}

/**
 * Fetch all combined notifications sorted chronologically
 */
export async function getDynamicNotifications(): Promise<{
  all: Notification[];
  orders: Notification[];
  promo: Notification[];
}> {
  const [orders, promo] = await Promise.all([fetchOrderNotifications(), fetchPromoNotifications()]);

  const all = [...orders, ...promo].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return { all, orders, promo };
}
