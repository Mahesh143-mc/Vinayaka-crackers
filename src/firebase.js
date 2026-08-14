import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase Configuration for Karuppa Crackers (Project: karuppacrackers-7bdac)
const firebaseConfig = {
  apiKey: "AIzaSyDaq--khTKdmDXM3jrFwlKyISyXXWb59xQ",
  authDomain: "karuppacrackers-7bdac.firebaseapp.com",
  projectId: "karuppacrackers-7bdac",
  storageBucket: "karuppacrackers-7bdac.firebasestorage.app",
  messagingSenderId: "231519398294",
  appId: "1:231519398294:web:fce9d24ccf34d898b915b7",
  measurementId: "G-11DKD8EVPD"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Analytics (optional/conditional)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
