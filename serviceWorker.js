const CACHE_NAME = "readora-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/favicon.ico",
    "/manifest.json",
    "/icons/icon-192x192",
    "/icons/icon-512x512.png",
    // Добавьте сюда другие файлы, которые нужно кэшировать
];

self.addEventListener("install", (event) => {
    // Предварительное кэширование
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    // Удаление старых кэшей
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

self.addEventListener("fetch", (event) => {
    // Возвращаем кэш или делаем сетевой запрос
    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).catch(() =>
                    caches.match("/offline.html") // если нужно, можно добавить offline fallback
                )
            );
        })
    );
});
