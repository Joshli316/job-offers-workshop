const CACHE = 'job-offers-workshop-v6';
const ASSETS = [
  '/',
  '/index.html',
  '/resources.html',
  '/404.html',
  '/styles.css',
  '/print.css',
  '/app.js',
  '/resources.js',
  '/404.js',
  '/qrcode.min.js',
  '/sitemap.xml',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
