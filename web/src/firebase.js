
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { fetchNotifications, incrementUnread } from "../src/config/notificationsSlice";
import store from "./store";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
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
      const token = await getToken(messaging, { vvapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
    }
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
};


// Listen for Foreground Messages
export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground Notification Received:", payload);

      // Dispatch Redux update
      store.dispatch(incrementUnread());
      store.dispatch(fetchNotifications());

      resolve(payload);

      if (payload.notification) {
        const { title, body } = payload.notification;
        new Notification(title, { body, icon: "/logo192.png" });
      }
    });
  });


export default app;
