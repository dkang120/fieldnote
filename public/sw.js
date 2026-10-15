/* Fieldnote service worker — lets the installed app open fast and keep working on a bad connection.
   Pages: network first, cached copy if offline. Hashed build files, images, fonts: cache first.
   Bump VERSION to drop old caches. */
const VERSION = "v1";
const PAGES = `fieldnote-pages-${VERSION}`;
const ASSETS = `fieldnote-assets-${VERSION}`;
const SCOPE = new URL(self.registration.scope).pathname; // "/" on Vercel, "/fieldnote/" on Pages

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((c) => c.addAll([SCOPE])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("fieldnote-") && k !== PAGES && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isAsset = (url) =>
  (url.origin === self.location.origin && /\/(_next\/static|img|icons|assets)\//.test(url.pathname)) ||
  url.hostname === "fonts.googleapis.com" ||
  url.hostname === "fonts.gstatic.com";

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(SCOPE)).then((r) => r || Response.error()))
    );
    return;
  }

  if (isAsset(url)) {
    // Hashed files never change: serve from cache. Images keep their names when swapped,
    // so serve the cached copy but refresh it in the background.
    const immutable = url.pathname.includes("/_next/static/") || url.hostname === "fonts.gstatic.com";
    event.respondWith(
      caches.match(req).then((hit) => {
        const refresh = () => fetch(req)
          .then((res) => {
            if (res.ok || res.type === "opaque") {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => hit || Response.error());
        if (hit && immutable) return hit;
        if (hit) {
          event.waitUntil(refresh());
          return hit;
        }
        return refresh();
      })
    );
  }
});
