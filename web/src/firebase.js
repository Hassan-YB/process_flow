
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBegFewwBTmpfUviALUfp6NfQRe_egOMm0",
  authDomain: "processflow-a00a7.firebaseapp.com",
  projectId: "processflow-a00a7",
  storageBucket: "processflow-a00a7.firebasestorage.app",
  messagingSenderId: "1068234439172",
  appId: "1:1068234439172:web:7d9bf652659fb1ee7f5351"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register Service Worker
navigator.serviceWorker.register("/firebase-messaging-sw.js")

// Request Notification Permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: "BPuYx4IA7SS5Hoqdn8IdnCASVqFwLVqMertnjRKwrvJe07w5drfDxWUU-w8NECtvZ7I8zzA6sn6kFoKUQI7IAjs" });
    }
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
};


// Listen for Foreground Messages
export const onMessageListener = () =>
  new Promise((resolve, reject) => {

    onMessage(messaging, (payload) => {
      resolve(payload);

      if (payload.notification) {
        const { title, body } = payload.notification;
        new Notification(title, { body, icon: "/logo192.png" });
      }
    });
  });

export default app;
