'use client';

import { useCallback, useEffect, useState } from 'react';

import { toast } from 'sonner';

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BB5oiIrq0hFGGMW6lA8Vam2ZacfQMP40nWibMle_pxhGU5UMZDhJDo4yaVQIekosLuVP7qmlO0RPHknD5JafvTg';

const PUSH_STORAGE_KEY = 'ff_push_subscribed';

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
 * Safely retrieves or registers the Service Worker with a timeout fallback
 * so code execution NEVER hangs indefinitely if the worker takes time to activate.
 */
async function getOrRegisterServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    let reg = await navigator.serviceWorker.getRegistration();
    if (!reg) {
      reg = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
    }

    // Ensure worker is ready with a 4-second timeout to prevent indefinite hanging
    const readyTimeout = new Promise<ServiceWorkerRegistration | null>((resolve) => {
      setTimeout(() => {
        resolve(reg || null);
      }, 4000);
    });

    const readyReg = await Promise.race([navigator.serviceWorker.ready, readyTimeout]);
    return readyReg || reg;
  } catch (err) {
    console.warn('[Push] Error getting service worker registration:', err);
    return null;
  }
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  // Check initial support and current subscription status
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const supported =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window &&
      (window.isSecureContext ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);

      // Check existing subscription
      void getOrRegisterServiceWorker().then(async (reg) => {
        if (!reg) {
          return;
        }
        try {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            setSubscription(sub);
            localStorage.setItem(PUSH_STORAGE_KEY, 'true');
          } else {
            // Check if user previously had it disabled
            localStorage.removeItem(PUSH_STORAGE_KEY);
          }
        } catch (err: unknown) {
          console.warn('[Push] Error checking existing subscription:', err);
        }
      });

      // Listen for permission changes in supporting browsers
      if ('permissions' in navigator && navigator.permissions?.query) {
        navigator.permissions
          .query({ name: 'notifications' })
          .then((permStatus) => {
            permStatus.onchange = () => {
              setPermission(Notification.permission);
            };
          })
          .catch(() => null);
      }
    }
  }, []);

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!isSupported) {
      toast.error('Push notifications are not supported on this browser or connection.');
      return null;
    }

    if (permission === 'denied') {
      toast.error(
        'Notifications are blocked in your browser settings. Please click the site icon in your address bar and allow notifications.',
      );
      return null;
    }

    setIsLoading(true);

    try {
      // 1. Request permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        if (result === 'denied') {
          toast.error(
            'Notification permission was blocked in browser settings. Please allow notifications in your browser address bar.',
          );
        } else {
          toast.info('Notification permission was dismissed.');
        }
        return null;
      }

      // 2. Ensure Service Worker registration is active
      const reg = await getOrRegisterServiceWorker();
      if (!reg) {
        throw new Error('Service worker registration could not be established.');
      }

      // 3. Obtain push subscription
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      }

      setSubscription(sub);
      try {
        localStorage.setItem(PUSH_STORAGE_KEY, 'true');
      } catch {
        // Silent catch
      }

      // 4. Sync subscription payload to server API
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      }).catch((err: unknown) => {
        console.warn('[Push] API registration sync note:', err);
      });

      // 5. Trigger a native test/confirmation notification so the user gets instant feedback
      try {
        await reg.showNotification('Fashion Friday Alerts Enabled', {
          body: 'You will now receive live updates on exclusive drops, order tracking, and restocks.',
          icon: '/icons/icon-192.png',
          badge: '/favicon-48x48.png',
          tag: 'ff-subscription-welcome',
        });
      } catch {
        // If native notification display is restricted, the UI toast still notifies
      }

      toast.success('Notifications enabled! You will receive live updates on drops and orders.');
      return sub;
    } catch (err: unknown) {
      console.error('[Push] Failed to subscribe:', err);
      const message =
        err instanceof Error ? err.message : 'Unable to enable notifications on this device.';
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const reg = await getOrRegisterServiceWorker();
      const currentSub = subscription || (await reg?.pushManager.getSubscription());

      if (currentSub) {
        const endpoint = currentSub.endpoint;
        await currentSub.unsubscribe().catch(() => null);

        // Notify backend unregistration
        await fetch('/api/notifications/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        }).catch((err: unknown) => {
          console.warn('[Push] API unregistration note:', err);
        });
      }

      setSubscription(null);
      try {
        localStorage.removeItem(PUSH_STORAGE_KEY);
      } catch {
        // Silent catch
      }

      toast.success('Notifications paused.');
    } catch (err: unknown) {
      console.error('[Push] Failed to unsubscribe:', err);
      toast.error('Failed to unsubscribe.');
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  return {
    isSupported,
    isSubscribed: Boolean(subscription),
    permission,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
