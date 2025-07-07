import { initializeApp, getApp, getApps } from "firebase/app";
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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };
