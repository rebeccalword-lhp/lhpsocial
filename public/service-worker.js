// LHP Social — Service Worker
// Caches the app shell so it loads instantly and works offline
const CACHE_NAME = "lhp-social-v2";
// Core files to cache on install
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];
// ── Install: cache core assets ──────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  // Take over immediately without waiting for old SW to finish
  self.skipWaiting();
});
// ── Activate: clean up old caches ───────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Claim all open clients immediately
  self.clients.claim();
});
// ── Fetch: cache-first for core, network-first for everything else ──
self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only handle GET requests
  if (request.method !== "GET") return;
  // Skip cross-origin requests (analytics, external fonts, etc.)
  if (!request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cached version AND refresh in background
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {}); // Silence network errors when offline
        return cached;
      }
      // Not in cache — fetch from network and cache it
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Offline fallback — return cached home page
          return caches.match("/");
        });
    })
  );
});
