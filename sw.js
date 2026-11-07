/* Schnurrologie: offline after the first visit. Network first for app files (new versions show at once), cache as fallback. */
var CACHE = 'schnurr-v1';
var SHELL = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/util.js', 'js/store.js', 'js/audio.js', 'js/cats.js', 'js/diagrams.js', 'js/content.js', 'js/engine.js', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== self.location.origin && !fonts) return;
  e.respondWith(caches.open(CACHE).then(function (cache) {
    if (fonts) {
      return cache.match(e.request).then(function (hit) {
        var net = fetch(e.request).then(function (res) { if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone()); return res; }).catch(function () { return hit; });
        return hit || net;
      });
    }
    return fetch(e.request, { cache: 'no-cache' }).then(function (res) { if (res && res.ok) cache.put(e.request, res.clone()); return res; })
      .catch(function () { return cache.match(e.request, { ignoreSearch: true }).then(function (hit) { return hit || cache.match('index.html'); }); });
  }));
});
