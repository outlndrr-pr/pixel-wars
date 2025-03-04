'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOJ7JsChpign1UUfiFS3ncOYfgimD--iA",
  authDomain: "pixel-wars-ab9f9.firebaseapp.com",
  projectId: "pixel-wars-ab9f9",
  storageBucket: "pixel-wars-ab9f9.appspot.com",
  messagingSenderId: "627738304675",
  appId: "1:627738304675:web:7381f252b37b5c5675df16",
  measurementId: "G-Z9025BQXQ2"
};

function initializeFirebase() {
  try {
    // Wait for window to be defined
    if (typeof window === 'undefined') {
      return { app: null, auth: null, db: null, analytics: null };
    }

    let app: FirebaseApp;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    const auth = getAuth(app);
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