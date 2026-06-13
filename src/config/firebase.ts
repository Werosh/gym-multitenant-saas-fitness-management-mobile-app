import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth, getAuth, initializeAuth, Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'YOUR_API_KEY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'YOUR_AUTH_DOMAIN',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'YOUR_STORAGE_BUCKET',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? 'YOUR_SENDER_ID',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? 'YOUR_APP_ID',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

function createAuth(firebaseApp: FirebaseApp): Auth {
  try {
    const authModule = require('@firebase/auth') as {
      getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
    };
    if (authModule.getReactNativePersistence) {
      return initializeAuth(firebaseApp, {
        persistence: authModule.getReactNativePersistence(AsyncStorage),
      });
    }
  } catch {
    // Fall back to default auth instance below.
  }
  return getAuth(firebaseApp);
}

export const auth = createAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

/** Secondary auth instance for creating users without signing out the current session. */
let secondaryApp: FirebaseApp | undefined;
let secondaryAuth: Auth | undefined;

export function getSecondaryAuth(): Auth {
  if (!secondaryAuth) {
    const existing = getApps().find((a) => a.name === 'Secondary');
    secondaryApp = existing ?? initializeApp(firebaseConfig, 'Secondary');
    secondaryAuth = createAuth(secondaryApp);
  }
  return secondaryAuth;
}

export default app;
