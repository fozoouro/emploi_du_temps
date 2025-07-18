self.addEventListener("install", function (e) {
    console.log("Service Worker installé.");
    e.waitUntil(
      caches.open("agenda-cache").then(function (cache) {
        return cache.addAll([
          "/",
          "/index.html",
          "/style.css",
          "/script.js",
          "/manifest.json"
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", function (e) {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  });
  