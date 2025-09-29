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
    Firestore, // NEW: For real-time updates
    Unsubscribe // NEW: For cleanup
    ,
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore, // NEW: For creating the listener query
    onSnapshot,
    query,
    setDoc,
    updateDoc
} from "firebase/firestore";
// NOTE: Make sure you have installed @react-native-async-storage/async-storage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// NOTE: Assuming Skill type is exported from app/components/AppTypes.ts
import { Skill } from "./app/components/AppTypes";

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
try {
    initializeAnalytics();
} catch (e) {
    console.warn("Analytics initialization skipped.", e);
}

// --- Firestore User Profile Types and Functions for Onboarding ---

// UPDATED: Added name field
export interface UserProfile {
    name: string; // NEW FIELD: User's chosen display name
    isNewUser: boolean;
    setupComplete: boolean;
}

/**
 * Creates the initial user document right after registration.
 */
// UPDATED: Function now accepts the user's display name
export const createInitialUserProfile = async (uid: string, name: string) => {
    const userRef = doc(db, "users", uid);
    const profile: UserProfile = {
        name: name, // Save the provided name
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

// --- NEW Firestore Function: Add Skill ---
export const addSkill = async (uid: string, skillData: Omit<Skill, 'id'>) => {
    if (!uid) throw new Error("User ID is required to add a skill.");
    
    const skillsCollectionRef = collection(db, "users", uid, "skills");

    const docRef = await addDoc(skillsCollectionRef, {
        ...skillData,
        currentLevel: 1,
        currentXP: 0,
        xpToNext: 100,
        createdAt: new Date(),
    });

    console.log("New skill added with ID:", docRef.id);
    return docRef.id;
};


// --- NEW Firestore Function: Get Real-Time Skills ---
/**
 * Sets up a real-time listener for the user's skills subcollection.
 */
export const getSkillsListener = (uid: string, callback: (skills: Skill[]) => void): Unsubscribe => {
    if (!uid) {
        // Return a mock cleanup function if UID is not available
        return () => {}; 
    }

    const skillsCollectionRef = collection(db, "users", uid, "skills");
    const skillsQuery = query(skillsCollectionRef); 

    const unsubscribe = onSnapshot(skillsQuery, (snapshot) => {
        const skillsArray = snapshot.docs.map(doc => ({
            id: doc.id,
            // Spread Firestore data and ensure it's cast to Skill type
            ...doc.data()
        })) as Skill[];
        
        callback(skillsArray);
    }, (error) => {
        console.error("Error setting up skills listener:", error);
    });

    return unsubscribe;
};


// Exporting necessary Auth types and functions
export {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
};
export type { User };
