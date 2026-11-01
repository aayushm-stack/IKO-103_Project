// Brahma Path Offline Background Service Worker
// Enables reliable local Smriti notification delivery in PWA / browser environments without external cloud servers.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing open Brahma Path window if available
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open the root
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_SMRITI_NOTIFICATION') {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title || 'Smriti Check-in — Brahma Path', {
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'smriti-checkin',
        renotify: true,
        ...options,
      })
    );
  }
});
