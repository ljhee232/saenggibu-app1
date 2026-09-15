const CACHE_NAME = "student-record-v2";

const FILES = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/add.html",
  "/records.html",
  "/summary.html",
  "/app.js",
  "/manifest.json",
  "/logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME)
              .map(key => caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});

// 페이지 이동은 항상 네트워크 우선
self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});