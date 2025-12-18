import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

try {
    if (typeof window !== "undefined" && !firebaseConfig.apiKey) {
        console.warn("Firebase config missing. Some features may not work.");
    }

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Provide dummy objects or re-throw depending on strictness. 
    // For now, let's allow the app to load even if Firebase fails, 
    // but subsequent calls might fail.
    // We can assign them to null or a mock if needed, but TS expects the types.
    // Let's try to get the existing app if possible, or just let it throw if it's critical.
    // Actually, if initializeApp fails, we can't really do much.
    // But to prevent the *module level* crash, we are catching it.

    // Assigning to 'any' to bypass strict type checks for the fallback
    app = {} as any;
    db = {} as any;
    storage = {} as any;
    auth = {
        onAuthStateChanged: () => () => { },
        currentUser: null,
    } as any;
}

export { db, storage, auth };

