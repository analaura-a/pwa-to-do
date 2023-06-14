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