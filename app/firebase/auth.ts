import { firebaseAuth as auth } from './config';
import {
  signInAnonymously,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';

// Enhanced helper function to wait for auth initialization with exponential backoff
const waitForAuth = async (maxAttempts = 5): Promise<void> => {
  let attempts = 0;
  while ((!auth || auth === null) && attempts < maxAttempts) {
    const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
    console.log(`Waiting for auth to initialize (attempt ${attempts + 1}/${maxAttempts})...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    attempts++;
  }
  if (!auth) {
    console.error('Firebase Auth failed to initialize after multiple attempts');
    throw new Error('Firebase Auth failed to initialize');
  }
};

// Sign in anonymously with improved retry logic
export const signInAnonymousUser = async (retries = 3) => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await waitForAuth();
      if (!auth) {
        console.error('Firebase Auth is not initialized');
        throw new Error('Firebase Auth is not initialized');
      }

      console.log('Attempting to sign in anonymously...');
      const result = await signInAnonymously(auth);
      console.log('Successfully signed in anonymously');
      return result.user;
    } catch (error) {
      lastError = error as Error;
      const authError = error as AuthError;
      
      // Handle specific Firebase auth errors
      if (authError.code === 'auth/configuration-not-found') {
        console.error('Firebase configuration not found. Check your Firebase configuration and environment variables.');
        // Wait longer for retries on this specific error
        if (attempt < retries) {
          const waitTime = Math.pow(2, attempt + 1) * 1500;
          console.log(`Waiting ${waitTime/1000} seconds before retry ${attempt + 1}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      } else {
        console.warn(`Sign in attempt ${attempt + 1} failed:`, error);
        if (attempt < retries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
  }

  console.error('All sign in attempts failed');
  throw lastError;
};

// Listen to auth state changes with error handling
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  if (!auth) {
    console.error('Firebase Auth is not initialized');
    return () => {};
  }

  let retryTimeout: NodeJS.Timeout | null = null;

  const unsubscribe = onAuthStateChanged(auth, 
    // Success callback
    async (user) => {
      if (!user) {
        try {
          await signInAnonymousUser();
        } catch (error) {
          console.error('Failed to sign in anonymously:', error);
          // Schedule retry
          if (retryTimeout) clearTimeout(retryTimeout);
          retryTimeout = setTimeout(() => {
            signInAnonymousUser().catch(console.error);
          }, 5000);
          callback(null);
        }
      } else {
        if (retryTimeout) clearTimeout(retryTimeout);
        callback(user);
      }
    },
    // Error callback
    (error) => {
      console.error('Auth state change error:', error);
      callback(null);
    }
  );

  return () => {
    if (retryTimeout) clearTimeout(retryTimeout);
    unsubscribe();
  };
};

// Get current user with retry logic
export const getCurrentUser = async () => {
  try {
    await waitForAuth();
    if (!auth) {
      console.error('Firebase Auth is not initialized');
      return null;
    }
    
    const user = auth.currentUser;
    if (!user) {
      return await signInAnonymousUser();
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Sign out with retry logic
export const signOut = async () => {
  try {
    await waitForAuth();
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    await auth.signOut();
    console.log('Successfully signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}; 