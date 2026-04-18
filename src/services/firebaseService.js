/**
 * Firebase Service (Optional Logging)
 * Purpose: Logs user queries for analytics.
 * Fail-safe: Gracefully falls back to local logging if not configured.
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db = null;

// Initialize Firebase only if the core config exists
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase init failed:", error);
  }
} else {
  console.log("ℹ️ Firebase config missing. Logging to console only.");
}

/**
 * Log user query (Non-blocking)
 * @param {string} query 
 * @param {string} intent 
 */
export async function logUserQuery(query, intent = "unknown") {
  const logData = {
    query,
    intent,
    timestamp: new Date().toISOString()
  };

  if (!db) {
    console.log("[Local Log]:", logData);
    return;
  }

  try {
    // Non-blocking fire and forget
    addDoc(collection(db, "queries"), {
      ...logData,
      serverTime: serverTimestamp()
    });
  } catch (e) {
    console.warn("Could not log to Firebase:", e);
  }
}
