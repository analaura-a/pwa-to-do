const cacheName = "v1";

const cachedAssets = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./html/list-page.html",
  "./html/detail-page.html",
  "./html/add-to-do-list.html",
  "./html/edit-to-do-list.html",
  "./js/list-page.js",
  "./js/detail-page.js",
  "./js/add-to-do-list.js",
  "./js/edit-to-do-list.js",
  "./json/tasks.json",
  "./json/taskslists.json",
  "./imgs/png/icon-72x72.png",
  "./imgs/png/icon-96x96.png",
  "./imgs/png/icon-128x128.png",
  "./imgs/png/icon-144x144.png",
  "./imgs/png/icon-152x152.png",
  "./imgs/png/icon-192x192.png",
  "./imgs/png/icon-384x384.png",
  "./imgs/png/icon-512x512.png",
  "./imgs/svg/check-list.svg",
  "./imgs/svg/logo-to-do.svg",
  "./manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(cachedAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//Estrategia de caché (Cache first, falling back to network)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      // Go to the cache first
      return cache.match(event.request.url).then((cachedResponse) => {
        // Return a cached response if we have one
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, hit the network
        return fetch(event.request).then((fetchedResponse) => {
          // Add the network response to the cache for later visits
          cache.put(event.request, fetchedResponse.clone());

          // Return the network response
          return fetchedResponse;
        });
      });
    })
  );
});
