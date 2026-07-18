const CACHE_NAME = "eazi-profit-v1";
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "logo.jpg",
  "manifest.json"
];

// Installs the background application assets locally
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercepts network calls to serve files locally instantly
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
