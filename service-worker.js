// public/service-worker.js
const CACHE_NAME = 'v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll([
                '/',
                '/index.html',
                '/static/manifest.json',
                OFFLINE_PAGE,
                //'/placeholder-cover.jpg'
            ]))
    );
});
