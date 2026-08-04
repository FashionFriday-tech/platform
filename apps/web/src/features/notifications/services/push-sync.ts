const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BB5oiIrq0hFGGMW6lA8Vam2ZacfQMP40nWibMle_pxhGU5UMZDhJDo4yaVQIekosLuVP7qmlO0RPHknD5JafvTg';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Automatically ensures the current device has an active PushManager subscription
 * and synchronizes it with the backend API if Notification permission is granted.
 */
export async function autoSyncCustomerPushSubscription(userId?: string): Promise<void> {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('Notification' in window)
  ) {
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      }
      if (reg && 'pushManager' in reg) {
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey,
          });
        }
        if (sub) {
          await fetch(`${API_URL}/notifications/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...sub.toJSON(),
              userId,
              userRole: 'CUSTOMER',
            }),
          });
        }
      }
    } catch (err) {
      console.warn('[Push] Auto sync error:', err);
    }
  }
}
