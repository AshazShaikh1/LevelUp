import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  Firestore,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc
} from "firebase/firestore";
// NOTE: Make sure you have installed @react-native-async-storage/async-storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db: Firestore = getFirestore(app);

// ✅ FIX 1: Initialize Auth with persistence
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// ✅ FIX 2: Initialize Analytics safely
const initializeAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// Suppress warnings in environments that don't support analytics (like dev web/simulator)
try {
  initializeAnalytics();
} catch (e) {
  console.warn("Analytics initialization skipped.", e);
}

// --- Firestore User Profile Types and Functions for Onboarding ---

// EXPORTED TYPE: Defines the user profile structure in Firestore
export interface UserProfile {
  isNewUser: boolean;
  setupComplete: boolean;
}

/**
 * Creates the initial user document right after registration.
 */
export const createInitialUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const profile: UserProfile = {
    isNewUser: true, 
    setupComplete: false,
  };
  await setDoc(userRef, profile);
};

/**
 * Retrieves the user's profile to check their onboarding status.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null; 
};

/**
 * Marks the user's onboarding/setup as complete.
 */
export const markUserSetupComplete = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    isNewUser: false,
    setupComplete: true,
  });
};

// Exporting necessary Auth types and functions
export {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
};
export type { User };

