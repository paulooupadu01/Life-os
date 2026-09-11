const CACHE_NAME = 'lifeos-cache-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Força a atualização imediata
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // Toma controle da página na mesma hora
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firestore.googleapis.com')) return;
  
  // Estratégia Network First: Tenta pegar o site novo na internet. Se estiver sem sinal, usa o cache.
  e.respondWith(
    fetch(e.request).then(response => {
       return response;
    }).catch(() => {
       return caches.match(e.request);
    })
  );
});
