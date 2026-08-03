'use client';

import { useEffect } from 'react';

export function PwaUpdateManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. One-time clean and filter of legacy mock team cache from old PWA installs
    try {
      const stored = localStorage.getItem('ff_admin_team_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (m) =>
              m.id !== '2' &&
              m.id !== '3' &&
              m.id !== '4' &&
              !['9876543210', '9876543211', '9876543212', '8888888888', '7777777777'].includes(
                m.phone?.replace(/\D/g, '') || '',
              ),
          );
          localStorage.setItem('ff_admin_team_members', JSON.stringify(cleaned));
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
