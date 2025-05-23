// public/service-worker.js
const CACHE_NAME = 'v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const OFFLINE_PAGE = "./offline.html";

const staticAssets = ["./", "./placeholder-cover.png", OFFLINE_PAGE];
self.addEventListener('install', async (event) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(staticAssets);
    
    console.log("install event");
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Кэшируем API запросы к контенту книг
    if (url.pathname.endsWith('/text')) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    const clone = networkResponse.clone();
                    console.log("fetch promise", networkResponse);
                    caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, clone));
                    return networkResponse;
                });
                return cached || fetchPromise.catch(() => caches.match('/offline.html'));
            })
        );
        return;
    }

    // Обработка текста книги
    if (url.pathname.endsWith('/text')) {
        event.respondWith(
            caches.match(event.request).then(cached => cached || fetch(event.request))
        );
        return;
    }

    // Навигационные запросы
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(res => res || fetch(event.request))
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'CACHE_BOOK') {
        caches.open('dynamic-v2').then(cache => {
            const response = new Response(JSON.stringify(event.data.payload.content), {
                headers: { 'Content-Type': 'application/json' }
            });
            cache.put(event.data.payload.url, response);
        });
    }
});
