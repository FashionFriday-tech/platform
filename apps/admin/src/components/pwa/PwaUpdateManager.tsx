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

    // 2. Global ChunkLoadError & dynamic import failure handler:
    // When a new Vercel deployment happens and client requests obsolete chunks,
    // immediately perform a clean reload instead of letting the browser show "This page couldn't load"
    const handleChunkError = (rawMsg: string) => {
      const msg = rawMsg.toLowerCase();
      if (
        msg.includes('chunkloaderror') ||
        msg.includes('loading chunk') ||
        msg.includes('failed to fetch dynamically imported module') ||
        msg.includes('loading css chunk')
      ) {
        const lastReload = Number(sessionStorage.getItem('ff_admin_chunk_reload_ts') || 0);
        if (Date.now() - lastReload > 8000) {
          sessionStorage.setItem('ff_admin_chunk_reload_ts', String(Date.now()));
          window.location.reload();
        }
      }
    };

    const onErrorListener = (e: ErrorEvent) => {
      handleChunkError(e.message || '');
    };
    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      handleChunkError(String(e.reason || ''));
    };

    window.addEventListener('error', onErrorListener);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    // 3. Service Worker lifecycle & update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // If a new worker is already waiting in background, immediately activate it
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

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

      // Reload smoothly when new service worker takes control (prevent infinite loops in mobile WebKit)
      let refreshing = false;
      let hadController = Boolean(navigator.serviceWorker.controller);
      const onControllerChange = () => {
        // Do not reload on initial service worker installation/activation
        if (!hadController) {
          hadController = true;
          return;
        }
        if (!refreshing) {
          try {
            const lastReload = Number(sessionStorage.getItem('ff_admin_sw_reload') || 0);
            if (Date.now() - lastReload > 15000) {
              refreshing = true;
              sessionStorage.setItem('ff_admin_sw_reload', String(Date.now()));
              window.location.reload();
            }
          } catch {
            // sessionStorage blocked or restricted in Safari
          }
        }
      };
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

      return () => {
        window.removeEventListener('error', onErrorListener);
        window.removeEventListener('unhandledrejection', onUnhandledRejection);
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      };
    }

    return () => {
      window.removeEventListener('error', onErrorListener);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return null;
}
