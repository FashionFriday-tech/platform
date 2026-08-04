'use client';

import { useEffect } from 'react';

export function PwaUpdateManager() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // 1. One-time clean and purge of legacy mock team & admin session cache from old PWA installs
    try {
      if (!localStorage.getItem('ff_admin_team_v5_single_admin')) {
        localStorage.removeItem('ff_admin_team_members');
        localStorage.removeItem('ff_admin_invited_team');
        localStorage.setItem('ff_admin_team_v5_single_admin', 'true');
      }

      const storedUser = localStorage.getItem('ff_admin_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        const clean = u.phone?.replace(/\D/g, '').slice(-10);
        const isMock =
          ['sarah chen', 'marcus johnson', 'emma williams', 'jimmy sullivan'].includes(
            u.name?.toLowerCase()?.trim(),
          ) ||
          ['9876543210', '9876543211', '9876543212', '8888888888', '7777777777'].includes(
            clean || '',
          );
        if (isMock) {
          localStorage.removeItem('ff_admin_user');
          localStorage.removeItem('adminAccessToken');
          localStorage.removeItem('adminRefreshToken');
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('ff_admin_pin_unlocked');
        }
      }
    } catch {
      // ignore
    }

    // 2. Service Worker lifecycle & update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Force check for fresh sw.js on every load
          registration.update().catch(() => null);

          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update is ready - trigger skip waiting
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch((err: unknown) => {
          console.warn('[PWA] SW registration failed:', err);
        });

      // Reload smoothly when new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
