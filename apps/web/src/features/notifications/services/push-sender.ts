import webpush from 'web-push';

export interface PushSubscriptionRecord {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string | null;
  createdAt: string;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  id?: string;
}

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BB5oiIrq0hFGGMW6lA8Vam2ZacfQMP40nWibMle_pxhGU5UMZDhJDo4yaVQIekosLuVP7qmlO0RPHknD5JafvTg';

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || '3pvwKuGD0M0JNr-BjIGhRUz0xajhKpVpVH7FOlGr2NE';

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@fashionfriday.in';

let isConfigured = false;

function setupWebPush() {
  if (!isConfigured) {
    try {
      webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
      isConfigured = true;
    } catch (err) {
      console.error('[WebPush] Error configuring VAPID details:', err);
    }
  }
}

// Global subscriptions registry in memory across requests in this Node process
// In persistent production, this syncs with the Database / Push Device registry
const globalSubscriptions = new Map<string, PushSubscriptionRecord>();

export const pushSubscriptionsStore = {
  add(sub: PushSubscriptionRecord) {
    globalSubscriptions.set(sub.endpoint, sub);
  },
  remove(endpoint: string) {
    globalSubscriptions.delete(endpoint);
  },
  getAll(): PushSubscriptionRecord[] {
    return Array.from(globalSubscriptions.values());
  },
  count(): number {
    return globalSubscriptions.size;
  },
};

/**
 * Send a Web Push notification to a specific subscription
 */
export async function sendWebPushToSubscriber(
  sub: PushSubscriptionRecord,
  payload: PushPayload,
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  setupWebPush();

  try {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    };

    const result = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icons/icon-192.png',
        badge: payload.badge || '/favicon-48x48.png',
        url: payload.url || '/account/notifications',
        id: payload.id || `push-${Date.now()}`,
      }),
    );

    return { success: true, statusCode: result.statusCode };
  } catch (error: any) {
    const statusCode = error?.statusCode;
    // 404 or 410 means subscription has expired or unsubscribed
    if (statusCode === 404 || statusCode === 410) {
      pushSubscriptionsStore.remove(sub.endpoint);
    }
    return {
      success: false,
      statusCode,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Broadcast notification to all active subscribers
 */
export async function broadcastWebPush(payload: PushPayload): Promise<{
  total: number;
  sent: number;
  failed: number;
}> {
  setupWebPush();
  const subscribers = pushSubscriptionsStore.getAll();

  if (subscribers.length === 0) {
    return { total: 0, sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subscribers.map(async (sub) => {
      const res = await sendWebPushToSubscriber(sub, payload);
      if (res.success) {
        sent++;
      } else {
        failed++;
      }
    }),
  );

  return { total: subscribers.length, sent, failed };
}
