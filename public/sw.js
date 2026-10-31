const CACHE_NAME = "desh-papers-cache-v2";

const PRECACHE_ASSETS = [
  "/",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/icon.svg",
  "/manifest.json",
  "/manifest.webmanifest"
];

// Install: Cache essential app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn("Pre-cache error:", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean up old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate for local UI, network-only for API and PDF downloads
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only intercept GET requests
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Exclude API calls, admin auth, Cloudflare R2 bucket, and Supabase calls
  if (
    url.pathname.startsWith("/api/") ||
    url.origin !== self.location.origin ||
    url.pathname.endsWith(".pdf")
  ) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      // Fetch fresh network version in parallel to update cache
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is navigation (HTML page), return cached home
          if (req.mode === "navigate") {
            return caches.match("/");
          }
        });

      // Return cached version immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

