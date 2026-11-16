const CACHE_NAME = 'ff-offline-v3';
const ASSETS_TO_CACHE = [
  '/offline.html',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Failed to cache: ${url}`, err);
          }),
        ),
      );
    }),
  );
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME && k.startsWith('ff-offline'))
            .map((k) => caches.delete(k)),
        );
      })
      .then(() => self.clients.claim())
      .catch((err) => {
        console.warn('[SW] Activation error:', err);
      }),
  );
});

self.addEventListener('fetch', (event) => {
  // 1. In local development, bypass service worker fetch completely so HMR and live reload are direct and never cached
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    return;
  }

  // 2. Only handle GET requests - NEVER intercept POST (prevents Next.js Server Action fetch errors)
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // 3. Bypass service worker for Next.js internal requests, API routes, Server Actions, RSC, Checkout, Account & Admin
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/__nextjs') ||
    url.pathname.startsWith('/checkout') ||
    url.pathname.startsWith('/account') ||
    url.pathname.startsWith('/admin') ||
    url.searchParams.has('_rsc') ||
    event.request.headers.get('next-action') ||
    event.request.headers.get('rsc')
  ) {
    return;
  }

  // 4. For page navigation: Network First, fallback to offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const offlinePage = await caches.match('/offline.html');
        return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
      }),
    );
    return;
  }

  // 5. For images & assets: Network First with Cache Fallback
  // Always returns a valid Response object (never undefined, preventing TypeError)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok && event.request.destination === 'image') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) {
          return cached;
        }
        return new Response('Asset unavailable offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      }),
  );
});

// --- PWA WEB PUSH NOTIFICATIONS ---
self.addEventListener('push', (event) => {
  let data = {
    title: 'Fashion Friday Alert',
    body: 'New exclusive drop & order updates are now live.',
    icon: '/icons/icon-192.png',
    badge: '/favicon-48x48.png',
    url: '/account/notifications',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/favicon-48x48.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/account/notifications',
      notificationId: data.id || String(Date.now()),
    },
    actions: [
      { action: 'open', title: 'View Update' },
      { action: 'close', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/account/notifications';

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
