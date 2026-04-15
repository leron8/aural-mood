import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDAzeB4OUE0G9Zp1rySlgpUgwFPLaWZi2I',
  authDomain: 'aura-tunes.firebaseapp.com',
  projectId: 'aura-tunes',
  storageBucket: 'aura-tunes.firebasestorage.app',
  messagingSenderId: '819802433955',
  appId: '1:819802433955:web:237f5531ee0c27f603d216',
  measurementId: 'G-8181S258B8',
};

let app = null;
let analytics = null;
let auth = null;
let firestore = null;
let storage = null;

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.warn('Firebase init failed:', err);
}

export { app, analytics, auth, firestore, storage };
