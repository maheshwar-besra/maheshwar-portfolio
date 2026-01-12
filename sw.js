const CACHE_NAME = "e4a-class-v1"; // Change v1 to v2 when you update the site

// Files to cache immediately
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./E4A_logo.png",
  // Student Images (Ensure filenames match exactly)
  "./Students/sk.png",
  "./Students/ks.png",
  "./Students/kh.png", // Fixed typo from your previous list (kg -> kh based on array)
  "./Students/krh.png",
  "./Students/kk.png",
  "./Students/nk.png"
];

// 1. Install & Cache Local Assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate & Clean Old Caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Strategy (Stale-While-Revalidate)
// This loads the cached version FIRST (fast), then updates in background.
// It also caches external Fonts/Icons dynamically.
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        // Clone and store in cache (useful for Google Fonts/Icons)
        if (e.request.method === "GET" && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If offline and no cache, do nothing (or show fallback)
      });

      return cachedResponse || fetchPromise;
    })
  );
});
