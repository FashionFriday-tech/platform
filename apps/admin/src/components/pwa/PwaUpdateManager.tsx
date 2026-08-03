'use client';

import { useEffect } from 'react';

export function PwaUpdateManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. One-time clean and purge of legacy mock team cache from old PWA installs
    try {
      if (!localStorage.getItem('ff_admin_team_v5_single_admin')) {
        localStorage.removeItem('ff_admin_team_members');
        localStorage.removeItem('ff_admin_invited_team');
        localStorage.setItem('ff_admin_team_v5_single_admin', 'true');
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
          registration.update().catch(() => {});

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
        .catch((err) => {
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
