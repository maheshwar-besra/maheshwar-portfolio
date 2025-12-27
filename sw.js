const CACHE = "e4a-cache-v1";

const ASSETS = [
  "./",
  "index.html",
  "E4A_logo.png",
  "Students/sk.png",
  "Students/ks.png",
  "Students/kg.png",
  "Students/krh.png",
  "Students/kk.png",
  "Students/nk.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

