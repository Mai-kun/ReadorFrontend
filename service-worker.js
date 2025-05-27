// public/service-worker.js
const CACHE_NAME = 'v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const OFFLINE_PAGE = "./offline.html";

const staticAssets = ["./", "./placeholder-cover.png", OFFLINE_PAGE, '/offline'];
self.addEventListener('install', async (event) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(staticAssets);
    self.skipWaiting(); // 🔧 Принудительно активируем новый SW
    console.log("install event");
});

self.addEventListener('fetch', (event) => {
    const basePath = '/readora-site/'; // Замените на имя вашего репозитория
    const url = new URL(event.request.url);

    // Кэшируем API запросы к контенту книг
    if (url.pathname.endsWith('/text')) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    const clone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, clone));
                    return networkResponse;
                });
                return cached || fetchPromise.catch(() => caches.match(OFFLINE_PAGE));
            })
        );
        return;
    }

    // Навигационные запросы
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(async () => {
                // Пытаемся найти закэшированные книги
                const cache = await caches.open(CACHE_NAME);
                const booksResponse = await cache.match(`${basePath}offline`);

                return booksResponse || caches.match(OFFLINE_PAGE);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});

// service-worker.js
self.addEventListener('message', async (event) => {
    if (event.data.action === 'CACHE_BOOK') {
        try {
            const cache = await caches.open(DYNAMIC_CACHE);
            for (const { url, content } of event.data.payload) {
                const response = new Response(JSON.stringify(content));
                await cache.put(url, response);
            }
            self.clients.matchAll().then(clients => {
                clients.forEach(client => client.postMessage({ action: 'CACHE_BOOK_SUCCESS' }));
            });
        } catch (error) {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => client.postMessage({ action: 'CACHE_BOOK_ERROR', error: error.message }));
            });
        }
    }
});


self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim().then(() => {
            console.log('Service Worker активирован и контролирует страницу');
        })
    );
});
