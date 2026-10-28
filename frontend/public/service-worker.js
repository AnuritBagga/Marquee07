/**
 * Service Worker for REAL Offline Exam Mode
 * Caches EVERYTHING so laptop can have WiFi completely OFF
 */

const CACHE_NAME = 'marquee-offline-v2';

// Install - Cache everything aggressively
self.addEventListener('install', (event) => {
  console.log('[SW] Installing for TRUE offline mode...');
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated - Ready for offline exams');
  event.waitUntil(self.clients.claim());
});

// Fetch - Cache EVERYTHING, serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => {
          // Offline - serve from cache
          return cache.match(event.request).then((cached) => {
            if (cached) {
              console.log('[SW] Serving from cache (OFFLINE):', event.request.url);
              return cached;
            }
            
            // Return index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return cache.match('/index.html');
            }
            
            return new Response('Offline', { status: 503 });
          });
        });
    })
  );
});
