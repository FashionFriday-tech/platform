'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';

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
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      void navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          setSubscription(sub);
        })
        .catch((err: unknown) => {
          console.warn('[Push] Error checking existing subscription:', err);
        });
    }
  }, []);

  const subscribe = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported on this browser/device.');
      return null;
    }

    setIsLoading(true);

    try {
      // 1. Request permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        if (result === 'denied') {
          toast.error('Notification permission was blocked in browser settings.');
        }
        return null;
      }

      // 2. Ensure Service Worker is ready
      const reg = await navigator.serviceWorker.ready;
      const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      // 3. Subscribe to push manager
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      setSubscription(sub);

      // 4. Send subscription to our Next.js API route
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      }).catch((err: unknown) => {
        console.warn('[Push] API registration sync note:', err);
      });

      toast.success('PWA push alerts enabled! You will receive live drop & order dispatches.');
      return sub;
    } catch (err: unknown) {
      console.error('[Push] Failed to subscribe:', err);
      toast.error('Unable to enable push notifications on this device.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) {
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      setSubscription(null);

      await fetch('/api/notifications/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      }).catch((err: unknown) => {
        console.warn('[Push] API unregistration note:', err);
      });

      toast.success('Push notifications paused.');
    } catch (err: unknown) {
      console.error('[Push] Failed to unsubscribe:', err);
      toast.error('Failed to unsubscribe.');
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
