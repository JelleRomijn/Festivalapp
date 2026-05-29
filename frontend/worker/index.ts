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
