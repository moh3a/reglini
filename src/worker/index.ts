import { config } from "dotenv";
declare let self: ServiceWorkerGlobalScope;

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
self.__WB_DISABLE_DEV_LOGS = true;

// listen to message event from window
self.addEventListener("message", async (event) => {
  // HOW TO TEST THIS?
  // Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})
  console.log(event?.data);

  /**
   * purpose of this code block found in this link
   * https://github.com/shadowwalker/next-pwa/tree/master/examples/cache-on-front-end-nav
   */
  if (event?.data && event.data.action === "CACHE_NEW_ROUTE") {
    caches.open("others").then((cache) =>
      cache.match(event.source?.url).then((res) => {
        if (res === undefined) {
          return cache.add(event.source.url);
        }
      })
    );
  }
});

self.addEventListener("appinstalled", (event) => {
  new Notification("reglini app", {
    body: "The reglini app was installed successfully",
    icon: "/icon-192x192.png",
  });
});

self.addEventListener("push", (event) => {
  const data = JSON.parse(event?.data.text() || "{}");
  event?.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/icon-192x192.png",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event?.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow("/");
      })
  );
});

// self.addEventListener("install", (event) => {
//   event?.waitUntil(
//     (async () => {
//       const cache = await caches.open(CACHE_NAME);
//       // Setting {cache: 'reload'} in the new request will ensure that the response
//       // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
//       await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
//     })()
//   );
// });

// self.addEventListener("activate", (event) => {
//   event?.waitUntil(
//     (async () => {
//       // Enable navigation preload if it's supported.
//       // See https://developers.google.com/web/updates/2017/02/navigation-preload
//       if ("navigationPreload" in self.registration) {
//         await self.registration.navigationPreload.enable();
//       }
//     })()
//   );

//   // Tell the active service worker to take control of the page immediately.
//   self.clients.claim();
// });
