const CACHE_NAME = 'cwb-cache-v2026-07-28';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/screenshot-mobile.png',
  '/screenshot-desktop.png'
];

// Install Event: Pre-cache core assets and force instant takeover
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core assets for installability');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Clear older caches to release space and claim all pages immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache storage:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event: Intelligently proxy assets and API requests
self.addEventListener('fetch', (event) => {
  // Only handle GET requests with http/https schemas
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Skip caching for backend API endpoints so user actions are always dynamic
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Network connection unavailable.' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  const isStaticAsset = url.pathname.includes('/assets/') || 
                        url.pathname.includes('/src/') || 
                        url.pathname.endsWith('.js') || 
                        url.pathname.endsWith('.css') || 
                        url.pathname.endsWith('.png') || 
                        url.pathname.endsWith('.json');

  if (isStaticAsset) {
    // Cache-First strategy for static JS, CSS, and asset files to speed up response times
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
    );
  } else {
    // Network-First with cache fallback for HTML pages and outer resources to allow updates
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          }
          
          // If server returns an error (e.g. 404, 503) for a navigation request, try cache fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/').then((cachedResponse) => {
              return cachedResponse || networkResponse;
            });
          }
          
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
        })
    );
  }
});
