// This is the "serving cached media" and "advanced caching" service worker
// Provided by Microsoft PWA Builder project

const AUDIO_CACHE = "audio";
const HTML_CACHE = "pages";
const JS_CACHE = "lib";
const STYLE_CACHE = "css";
const IMAGE_CACHE = "img";
const FONT_CACHE = "fonts";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-range-requests');

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: HTML_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: JS_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: STYLE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: IMAGE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: FONT_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
    /.*\.mp3/,
    new workbox.strategies.CacheFirst({
      cacheName: AUDIO_CACHE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({statuses: [200]}),
        new workbox.rangeRequests.RangeRequestsPlugin(),
      ],
    }),
  );
  
workbox.routing.registerRoute(
    /.*\.igg/,
    new workbox.strategies.CacheFirst({
      cacheName: AUDIO_CACHE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({statuses: [200]}),
        new workbox.rangeRequests.RangeRequestsPlugin(),
      ],
    }),
  );

