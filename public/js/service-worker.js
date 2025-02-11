const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
    '/',
    '/css/carousel.css',
    '/css/features.css',
    '/css/sign-in.css',
    '/css/style.css',
    '/js/back-button.js',
    '/js/color-modes.js',
    '/js/install-prompt.js',
    '/js/kakaomap.js',
    '/js/market-list.js',
    '/js/service-worker.js',
    '/js/sign-in.js',
    '/js/sign-up/form.js',
    '/js/sign-up/select.js',
    '/images/ar-logo.png',
    // 등등...
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
