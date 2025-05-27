// Firebase configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let db;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  
  // Use emulator in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Only connect to emulator in browser environment and if not already connected
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      // Emulator might already be connected, ignore error
      console.warn('Firebase emulator connection warning:', error.message);
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback for when Firebase config is missing
  app = null;
  db = null;
}

export { app, db };