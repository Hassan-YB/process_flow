importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js");


firebase.initializeApp({
  apiKey: "AIzaSyBegFewwBTmpfUviALUfp6NfQRe_egOMm0",
  authDomain: "processflow-a00a7.firebaseapp.com",
  projectId: "processflow-a00a7",
  storageBucket: "processflow-a00a7.firebasestorage.app",
  messagingSenderId: "1068234439172",
  appId: "1:1068234439172:web:7d9bf652659fb1ee7f5351"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
  });
});
