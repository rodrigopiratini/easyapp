// Service worker do painel de gestão: só recebe os avisos (Web Push) — não guarda nada em cache.
// Publicado na raiz do site (easyappfinancial.com.br/sw-gestao.js), escopo "gestao".
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'EasyAPP Gestão', {
    body: d.body || '', tag: d.tag || undefined, renotify: !!d.tag, icon: 'img/icone-192.png', badge: 'img/icone-192.png', data: { url: d.url || 'gestao.html' },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || 'gestao.html';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    for (const c of cs) if (c.url.indexOf('gestao') >= 0 && 'focus' in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
