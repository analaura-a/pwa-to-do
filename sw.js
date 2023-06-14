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
    "./imgs/png/",
    "./imgs/svg/"
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
})

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

self.addEventListener("fetch", (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
})

//Estrategia de caché (Cache first, falling back to network)
self.addEventListener('fetch', (event) => {
 
    event.respondWith(caches.open(cacheName).then((cache) => {
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
    }));
 
});