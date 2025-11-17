const CACHE_NAME = 'clima-pwa-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png'
];

// Evento 'install': Salva os assets principais no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto e adicionando assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Evento 'activate': Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento 'fetch': Responde com "cache primeiro" (Cache-First)
self.addEventListener('fetch', (event) => {
  // Ignora chamadas para nossa API (sempre busca na rede)
  if (event.request.url.includes('/api/')) {
    return event.respondWith(fetch(event.request));
  }

  // Para todos os outros assets, usa a estratégia Cache-First
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se tiver no cache, retorna do cache
        if (response) {
          return response;
        }
        // Se não, busca na rede
        console.log('Service Worker: Buscando na rede:', event.request.url);
        return fetch(event.request);
      })
  );
});