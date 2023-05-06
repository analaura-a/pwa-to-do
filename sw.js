if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("./sw.js")
            .then(res => console.log("service worker registrado", res))
            .catch(err => console.log("service worker no registrado", err));
    });
}

self.addEventListener('install', async e => {
    console.log("Service Worker instalado");

    var cache = await caches.open("pwa-static");
    cache.addAll([
        "./",
        "./index.html",
        "./css/styles.css",
        "./html/app.html",
        "./js/app.js",
        "./tasks.json",
        "./imgs/png/",
    ]);
});

self.addEventListener("activate", () => {
    console.log("Service Worker activado");
})

self.addEventListener('fetch', () => console.log("fetch"));