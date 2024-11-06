// public/service-worker.js

// Set the cache name
const CACHE_NAME = 'my-app-cache';

// List of assets to cache
const urlsToCache = [
  '/',
  '/index.html',
  // Add other assets (CSS, JS, images) that you want to cache
];

// Install event for caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event to serve assets from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
