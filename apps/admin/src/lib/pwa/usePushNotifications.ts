'use client';

import { useEffect, useState } from 'react';

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BG8TIOEES1QD8VRyeZj7QNSS7XETzail2Dn-ul7zLJSG7BFIK1nPgGbjt1icLvHT2TdtFCbItVeCkv1WFnaBv_M';

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

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });
      });
    }
  }, []);

  const subscribe = async () => {
    if (!isSupported) return null;
    setIsLoading(true);

    try {
      const reg = await navigator.serviceWorker.ready;
      const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      setSubscription(sub);
      setPermission(Notification.permission);

      // Save subscription to backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fashionfriday.in';
      await fetch(`${apiUrl}/admin/notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      }).catch((err) => console.warn('[Push] Backend sync note:', err));

      return sub;
    } catch (err) {
      console.error('[Push] Failed to subscribe:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;
    setIsLoading(true);

    try {
      await subscription.unsubscribe();
      setSubscription(null);
    } catch (err) {
      console.error('[Push] Failed to unsubscribe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed: Boolean(subscription),
    permission,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
