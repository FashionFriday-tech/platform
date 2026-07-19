'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    // In development mode, completely unregister service workers and clear caches
    // so Next.js HMR, Hot Reloading, and latest updates render immediately without stale cache
    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      return;
    }

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    // Prevent any browser-internal service worker update rejection from surfacing in Next.js error overlay
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as unknown;
      const message =
        reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : '';
      if (message.includes('ServiceWorker') || message.includes('sw.js')) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);

    // Clean up any stale, orphan, or corrupted service worker registrations
    navigator.serviceWorker
      .getRegistrations()
      .then(async (registrations) => {
        for (const reg of registrations) {
          const script =
            reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL;
          if (!script?.endsWith('/sw.js')) {
            await reg.unregister().catch(() => null);
          }
        }
      })
      .catch(() => null);

    let cleanupVisibility: (() => void) | null = null;

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        // If there's already a new worker waiting, activate it immediately
        if (registration.waiting && navigator.serviceWorker.controller) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Listen for new worker updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;

          if (!installingWorker) {
            return;
          }

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Tell the new service worker to take control immediately
              installingWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          };
        };

        // Proactively check for code updates immediately on launch
        registration.update().catch(() => null);

        // Check for updates whenever the user returns to the PWA (resumes app)
        const handleVisibility = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => null);
          }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Periodically check every 15 minutes while app is running
        const intervalId = setInterval(() => {
          registration.update().catch(() => null);
        }, 15 * 60 * 1000);

        cleanupVisibility = () => {
          document.removeEventListener('visibilitychange', handleVisibility);
          clearInterval(intervalId);
        };
      })
      .catch(() => {
        // Silent catch
      });

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      if (cleanupVisibility) {
        cleanupVisibility();
      }
    };
  }, []);

  return null;
}
