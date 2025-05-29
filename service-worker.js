// public/service-worker.js
const basePath = '/readora-site';
const CACHE_NAME = 'v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const OFFLINE_PAGE = `${basePath}/offline.html`;

const staticAssets = [
    `${basePath}/`,
    `${basePath}/placeholder-cover.png`,
    OFFLINE_PAGE,
    `${basePath}/index.html`,
    `${basePath}/manifest.json`,
    // Добавляем основные ресурсы приложения
    `${basePath}/static/js/main.js`,
    `${basePath}/static/css/main.css`,
    // Добавляем иконки и другие статические ресурсы
];

self.addEventListener('install', async (event) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(staticAssets);
    self.skipWaiting();
    console.log("Service Worker установлен");
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Обработка API запросов для контента книг
    if (url.pathname.endsWith('/text')) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                return cached || fetch(event.request)
                    .then(networkResponse => {
                        const clone = networkResponse.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => cache.put(event.request, clone));
                        return networkResponse;
                    })
                    .catch(() => caches.match(OFFLINE_PAGE));
            })
        );
        return;
    }

    // Навигационные запросы
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(async () => {
                // Всегда возвращаем офлайн-страницу при ошибке сети
                return caches.match(OFFLINE_PAGE);
            })
        );
    }
    // Статические ресурсы и другие запросы
    else {
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

            for (const { url, response } of event.data.payload) {
                const { body, headers } = response;
                await cache.put(url, new Response(body, { headers }));
            }

            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({ action: 'CACHE_BOOK_SUCCESS' });
            });

        } catch (error) {
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({ action: 'CACHE_BOOK_ERROR', error: error.message });
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
