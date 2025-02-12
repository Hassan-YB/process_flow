importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey: "AIzaSyBegFewwBTmpfUviALUfp6NfQRe_egOMm0",
  authDomain: "processflow-a00a7.firebaseapp.com",
  projectId: "processflow-a00a7",
  storageBucket: "processflow-a00a7.firebasestorage.app",
  messagingSenderId: "1068234439172",
  appId: "1:1068234439172:web:7d9bf652659fb1ee7f5351"
};


// Initialize Firebase in the Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// **Handle Background Push Messages**
self.addEventListener("push", function (event) {
  
  if (event.data) {
    const payload = event.data.json();

    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
      body: payload.notification?.body || "You have a new message.",
      icon: "/logo192.png",
      badge: "/logo192.png",
      data: { url: payload.notification?.click_action || "/" }
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

// **Handle Notification Click Events**
self.addEventListener("notificationclick", function (event) {

  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        for (let client of windowClients) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

// **Handle Background Messages**
messaging.onBackgroundMessage((payload) => {

  const notificationTitle = payload.notification?.title || "New Background Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new background message.",
    icon: "/logo192.png",
    badge: "/logo192.png",
    data: { url: payload.notification?.click_action || "/" }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

