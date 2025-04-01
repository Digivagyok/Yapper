const CACHE_NAME = "yapper-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// Install the service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch cached assets
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activate the service worker
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle push events
self.addEventListener("push", (event) => {
    if (!event.data) {
        console.error("Push event has no data.");
        return;
    }

    const data = event.data.json();
    console.log("Push event received:", data);
    
    const options = {
        body: data.body,
        icon: data.icon || "/icons/icon-192x192.png", // Use provided icon or fallback
        badge: data.badge || "/icons/icon-192x192.png", // Use provided badge or fallback
        data: data.url || "/", // Attach a URL to the notification for click handling
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data || "/"; // Default to root if no URL is provided

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === urlToOpen && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});