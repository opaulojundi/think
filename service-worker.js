const CACHE_NAME = 'think-corp-cache-v2';

// Arquivos essenciais para o funcionamento offline (App Shell)
// Nota: Remova o primeiro '/' das rotas relativas para evitar problemas de subdiretórios
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './header.html',
  './footer.html',
  './css/themes.css',
  './css/style.css',
  './css/responsive.css',
  './js/main.js',
  './js/theme.js',
  './js/feedback.js',
  './manifest.json',
  './assets/img/think_b.svg',
  './assets/img/think_w.svg',
  './assets/img/favicon.svg',
  // CDNs externas fundamentais
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
      // Usamos uma abordagem que não quebra a instalação caso um link externo falhe temporariamente
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => console.warn(`Falha ao cachear: ${url}`, err));
        })
      );
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
  // Ignora requisições de métodos que não sejam GET (como POST, PUT)
  if (event.request.method !== 'GET') return;

  // Ignora requisições de mapas do Google ou externas não cruciais para o layout offline
  if (event.request.url.includes('googleusercontent') || event.request.url.includes('maps')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request)
          .then((networkResponse) => {
            // Atualiza o cache dinamicamente se a resposta da rede for válida
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Fallback: Se falhar a rede e não houver cache, evita tela em branco de erro
            return cachedResponse || new Response('Conteúdo indisponível offline.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
            });
          });

        // Retorna o cache imediatamente se existir, ou espera a rede
        return cachedResponse || fetchedResponse;
      });
    })
  );
});
