// public/service-worker.js
const CACHE_NAME = 'v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const OFFLINE_PAGE = '/offline.html';

const staticAssets = ["./", "./index.html", "./js/app.js", "./css/styles.css"];
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(staticAssets))
    );
    console.log("install event");
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Кэшируем API запросы к контенту книг
    if (url.pathname.endsWith('/text')) {
        event.respondWith(
            caches.match(event.request)
                .then(cached => cached || fetch(event.request)
                ));
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(OFFLINE_PAGE))
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'CACHE_BOOK') {
        const { url, content } = event.data.payload;
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    const response = new Response(JSON.stringify(content), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                    return cache.put(url, response);
                })
        );
    }
});
