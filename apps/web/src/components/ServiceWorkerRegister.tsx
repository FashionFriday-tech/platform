'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
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

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
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
      })
      .catch(() => {
        // Silent catch
      });

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
