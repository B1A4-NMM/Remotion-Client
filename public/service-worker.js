
// public/service-worker.js
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  let data;
  try {
    data = event.data.json();
    console.log('[Service Worker] Push data parsed:', data);
  } catch (e) {
    console.error('[Service Worker] Error parsing push data, using plain text.');
    data = { title: 'New Notification', body: event.data.text() };
  }

  const title = data.title || 'Default Title';
  const options = {
    body: data.body || 'Default body text.',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: data.data // Ensure data for notification click is passed
  };

  console.log(`[Service Worker] Attempting to show notification with title: "${title}" and options:`, options);

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('[Service Worker] showNotification promise resolved.');
      })
      .catch((err) => {
        console.error('[Service Worker] showNotification promise rejected:', err);
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
