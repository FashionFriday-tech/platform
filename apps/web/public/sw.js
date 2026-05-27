const VERSION = 'v1.0.1';

const STATIC_CACHE = `ff-static-${VERSION}`;
const DYNAMIC_CACHE = `ff-dynamic-${VERSION}`;
const IMAGE_CACHE = `ff-images-${VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

/* ---------------- INSTALL ---------------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

/* ---------------- ACTIVATE ---------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

/* ---------------- FETCH ---------------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation fallback (App Router safe)
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')));
    return;
  }

  // Images → Cache First
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 60));
    return;
  }

  // API → Network First
  if (url.pathname.startsWith('/api')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Pages & static assets → Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

/* ---------------- STRATEGIES ---------------- */

async function cacheFirst(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (!response || response.status !== 200) return response;

  cache.put(request, response.clone());
  if (limit) trimCache(cacheName, limit);

  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request)) || caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItems);
  }
}

/* ---------------- MESSAGES ---------------- */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
