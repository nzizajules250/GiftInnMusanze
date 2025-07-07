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
let app;
if (getApps().length) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}
const db = getFirestore(app);

export { app, db };
