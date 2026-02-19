'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Listen for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;

          if (!installingWorker) {
            return;
          }

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              alert('New version available. Refresh to update.');
            }
          };
        };
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }, []);

  return null;
}
