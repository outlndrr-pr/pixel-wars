import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { Analytics, getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required config values are present
const isConfigValid = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'databaseURL'];
  return requiredKeys.every(key => !!firebaseConfig[key as keyof typeof firebaseConfig]);
};

let app: FirebaseApp;
let db: Database;
let auth: Auth;
let analytics: Analytics | null = null;

// Only initialize Firebase on the client side and if not already initialized
if (typeof window !== 'undefined') {
  try {
    if (!isConfigValid()) {
      console.warn('Firebase config is incomplete. Some features may not work.');
    }

    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized');
    } else {
      app = getApps()[0];
      console.log('Using existing Firebase app');
    }

    // Initialize services
    db = getDatabase(app);
    auth = getAuth(app);
    
    // Only initialize analytics in production
    if (process.env.NODE_ENV === 'production') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Create fallback implementations for development/testing
    app = {} as FirebaseApp;
    db = {} as Database;
    auth = {} as Auth;
  }
} else {
  console.log('Window is undefined, skipping Firebase initialization');
  // Server-side placeholders
  app = {} as FirebaseApp;
  db = {} as Database;
  auth = {} as Auth;
}

export { app, db, auth, analytics }; 