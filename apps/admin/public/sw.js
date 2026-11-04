// Fashion Friday Admin Service Worker
const CACHE_NAME = 'ff-admin-v9-stable';
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

  // Strictly skip cross-origin requests (e.g. backend API, external assets, CDNs)
  // Let the browser handle cross-origin network operations natively without SW interference
  if (url.origin !== self.location.origin) {
    return;
  }

  // Strictly bypass service worker for Next.js internal chunks, static assets, and APIs
  // This prevents ChunkLoadError and avoids serving synthetic timeouts on iPad / WebKit
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/__nextjs') ||
    url.pathname.includes('/admin/team') ||
    url.pathname.includes('/orders') ||
    url.pathname.includes('/maintenance') ||
    event.request.headers.get('next-action') ||
    event.request.headers.get('rsc')
  ) {
    return;
  }

  // Navigation requests (HTML pages): Strictly network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline | Fashion Friday</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;text-align:center;padding:24px;}h1{font-size:20px;font-weight:700;margin-bottom:8px;}p{font-size:14px;color:#888;margin-bottom:24px;}button{background:#fff;color:#000;border:none;padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px;cursor:pointer;}</style></head><body><h1>Offline Mode</h1><p>Check your internet connection to continue.</p><button onclick="window.location.reload()">Reload</button></body></html>',
            { headers: { 'Content-Type': 'text/html' }, status: 200 },
          );
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
        return fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => new Response('', { status: 404, statusText: 'Not Found' }));
      }),
    );
    return;
  }

  // For any other requests, do not intercept; let the browser fetch directly
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

  // WebKit / iOS Safari safe notification options:
  // actions and vibrate throw TypeErrors in Safari
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/icon-192.png',
    data: { url: data.url || '/' },
  };

  if ('vibrate' in self.navigator) {
    options.vibrate = [200, 100, 200];
  }

  if (typeof Notification !== 'undefined' && 'actions' in Notification.prototype) {
    options.actions = [
      { action: 'open', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' },
    ];
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options).catch(() => {
      // Safe fallback for WebKit if any extended property is rejected
      return self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/icons/icon-192.png',
      });
    }),
  );

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
