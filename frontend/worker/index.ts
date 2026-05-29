// Admin navigation: always fetch from server, bypassing HTTP cache and any
// Workbox route. Prevents stale HTML (with old chunk hashes) from being served.
// This listener is registered before Workbox routes (via importScripts order),
// so our respondWith wins for admin navigations.
self.addEventListener("fetch", (event: Event) => {
  const fe = event as FetchEvent;
  if (
    fe.request.mode === "navigate" &&
    new URL(fe.request.url).pathname.includes("/admin")
  ) {
    fe.respondWith(fetch(fe.request, { cache: "no-store" }));
  }
});

// Clear all runtime caches on SW activation so stale HTML, JS chunks,
// and asset references from previous builds are never served.
// Workbox precache is managed separately and stays intact.
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith("workbox-precache"))
          .map((key) => caches.delete(key))
      )
    )
  );
});
