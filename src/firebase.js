import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase config from environment (see .env.example)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (wrap in try/catch so config errors don't crash the app)
let app;
let analytics;
try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
} catch (err) {
  console.warn("Firebase init failed:", err);
  app = null;
  analytics = null;
}
export { app, analytics };
