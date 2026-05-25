/* Audio cache Service Worker — caches only audio files from Lovable Cloud storage.
   Does not touch any other request type, so app navigation, chat, API, and assets
   are completely untouched. */
const CACHE = "audio-cache-v1";
const AUDIO_HOST = "ubrbvkaspsphdxpsvazq.supabase.co";
const AUDIO_PATH = "/storage/v1/object/public/audio/";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

function isAudioRequest(url) {
  return url.hostname === AUDIO_HOST && url.pathname.startsWith(AUDIO_PATH);
}

self.addEventListener("fetch", (event) => {
  let url;
  try { url = new URL(event.request.url); } catch { return; }
  if (!isAudioRequest(url)) return; // ignore everything else

  // Range requests can't be cached by the SW reliably — let the browser handle them.
  if (event.request.headers.has("range")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(event.request, { ignoreVary: true });
      if (cached) return cached;

      try {
        const resp = await fetch(event.request);
        // Only cache full successful responses
        if (resp.ok && resp.status === 200) {
          cache.put(event.request, resp.clone()).catch(() => {});
        }
        return resp;
      } catch (err) {
        // Offline fallback: try cache again with ignoreSearch
        const fallback = await cache.match(event.request, { ignoreVary: true, ignoreSearch: true });
        if (fallback) return fallback;
        throw err;
      }
    })()
  );
});
