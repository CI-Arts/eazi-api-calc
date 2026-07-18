const CACHE_NAME = "eazi-profit-v2"; // We changed v1 to v2 to force your phone to update its memory cache!
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "logo.png",
  "logo.jpg",
  "manifest.json"
];
// ... leave the rest of your sw.js file exactly as it was


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
