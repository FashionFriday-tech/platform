// Fashion Friday Admin Service Worker
const CACHE_NAME = 'ff-admin-v5-clean';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
];

// Install: Cache essential static icon assets & activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
  }
});

// Activate: Delete all previous caches to force-update installed PWAs
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        );
      })
      .then(() => self.clients.claim())
      .catch((err) => {
        console.warn('[PWA] Activation error:', err);
      }),
  );
});

// Fetch: Strict network-first for pages and APIs to prevent stale caches
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // NEVER cache API requests
  if (
    url.pathname.includes('/api/') ||
    url.pathname.includes('/admin/team') ||
    url.pathname.includes('/orders') ||
    url.pathname.includes('/maintenance')
  ) {
    return;
  }

  // Navigation requests (HTML pages): Strictly network-first with no-cache revalidation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((response) => {
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return caches.match('/');
          });
        }),
    );
    return;
  }

  // Static assets (fonts, icons, images)
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    }),
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'Fashion Friday Admin',
    body: 'New update received.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    url: '/orders',
  };

  try {
    if (event.data) {
      data = Object.assign(data, event.data.json());
    }
  } catch {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));

  // Update App Badge if supported
  if ('setAppBadge' in navigator && data.badgeCount !== undefined) {
    navigator.setAppBadge(data.badgeCount).catch(() => {});
  }
});

// Handle Notification Clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    }),
  );
});
