'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Fallback configuration for development if environment variables are missing
const localDevConfig = {
  apiKey: "AIzaSyAOJ7JsChpign1UUfiFS3ncOYfgimD--iA",
  authDomain: "pixel-wars-ab9f9.firebaseapp.com",
  projectId: "pixel-wars-ab9f9",
  storageBucket: "pixel-wars-ab9f9.firebasestorage.app",
  messagingSenderId: "627738304675",
  appId: "1:627738304675:web:7381f252b37b5c5675df16",
  measurementId: "G-Z9025BQXQ2"
};

// Use localDevConfig as fallback if any of the environment variables are missing
const getValidConfig = () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.warn('Firebase environment variables not found, using development fallback configuration');
    return localDevConfig;
  }
  return firebaseConfig;
};

function initializeFirebase() {
  try {
    // Wait for window to be defined
    if (typeof window === 'undefined') {
      return { app: null, auth: null, db: null, analytics: null };
    }

    // Get valid configuration
    const validConfig = getValidConfig();

    let app: FirebaseApp;
    if (!getApps().length) {
      console.log('Initializing Firebase with config:', {
        projectId: validConfig.projectId,
        authDomain: validConfig.authDomain
      });
      app = initializeApp(validConfig);
    } else {
      app = getApps()[0];
    }

    const auth = getAuth(app);
    
    // Set auth persistence to LOCAL to avoid CORS issues with iframe auth
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error('Error setting auth persistence:', error);
      });
    
    const db = getFirestore(app);
    let analytics: Analytics | undefined;

    // Initialize analytics in production only
    if (process.env.NODE_ENV === 'production') {
      isSupported().then(supported => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      });
    }

    return { app, auth, db, analytics };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return { app: null, auth: null, db: null, analytics: null };
  }
}

// Initialize Firebase only on the client side
const firebase = initializeFirebase();

export const { 
  app: firebaseApp, 
  auth: firebaseAuth, 
  db: firebaseDB, 
  analytics: firebaseAnalytics 
} = firebase; 