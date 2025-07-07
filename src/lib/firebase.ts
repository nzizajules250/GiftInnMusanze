import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBz0O__fz3KSWuiH5NbxEAFHV0UUF4Fhxk",
  authDomain: "giftinndata.firebaseapp.com",
  projectId: "giftinndata",
  storageBucket: "giftinndata.firebasestorage.app",
  messagingSenderId: "50083531562",
  appId: "1:50083531562:web:0082e9b9a50998a7b6ec53",
  measurementId: "G-JNMF03EGFX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Analytics can be initialized here if needed, but we check for window object
if (typeof window !== 'undefined') {
    getAnalytics(app);
}

export { app, db };
