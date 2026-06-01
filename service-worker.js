const CACHE_NAME = 'think-corp-cache-v1';

// Arquivos essenciais para o funcionamento offline (App Shell)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/header.html',
  '/footer.html',
  '/css/themes.css',
  '/css/style.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/theme.js',
  '/js/feedback.js',
  '/manifest.json',
  '/assets/img/thinkc_b.svg',
  '/assets/img/thinkc_w.svg',
  '/assets/img/think_b.svg',
  '/assets/img/think_w.svg',
  '/assets/img/favicon.svg',
  // CDNs e Fontes externas também podem ser cacheadas
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Syne:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap'
];

// Instalação: Salva o App Shell no Cache Storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Ativação: Limpa caches antigos se houver atualização de versão
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições: Estratégia Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  // Ignora requisições de mapas do Google ou externas não cruciais para o layout offline
  if (event.request.url.includes('googleusercontent') || event.request.url.includes('maps')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          // Atualiza o cache dinamicamente se a resposta da rede for válida
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Fallback silencioso caso esteja totalmente offline e sem cache
        });

        // Retorna o cache imediatamente se existir, ou espera a rede
        return cachedResponse || fetchedResponse;
      });
    })
  );
});
