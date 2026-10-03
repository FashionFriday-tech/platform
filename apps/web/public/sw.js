const CACHE_NAME = 'ff-offline-v2';
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
  // 1. Only handle GET requests - NEVER intercept POST (prevents Next.js Server Action fetch errors)
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // 2. Bypass service worker for Next.js internal requests, API routes, Server Actions, RSC, and HMR
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/__nextjs') ||
    event.request.headers.get('next-action') ||
    event.request.headers.get('rsc')
  ) {
    return;
  }

  // 3. For page navigation: Network First, fallback to offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
    return;
  }

  // 4. For images & assets: Network First with Cache Fallback
  // Always fetches fresh live content and updates cache in background so changes reflect immediately in PWA
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.ok && event.request.destination === 'image') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      }),
  );
});
