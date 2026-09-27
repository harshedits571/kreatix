import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyC6h1Pw6b_TkrGD9HWT8D3pR5gnJQNuLuE",
  authDomain: "aryan-e27b3.firebaseapp.com",
  projectId: "aryan-e27b3",
  storageBucket: "aryan-e27b3.firebasestorage.app",
  messagingSenderId: "317907170882",
  appId: "1:317907170882:web:7ee80e264053c64416dfdb",
  measurementId: "G-LHZJDWZ2MX"
};

let app;
let db = null;
let analytics = null;
let isFirebaseOnline = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  isFirebaseOnline = true;

  if (typeof window !== "undefined") {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} catch (error) {
  console.warn("⚠️ Firebase fallback mode:", error?.message);
}

export { 
  app, 
  db, 
  analytics, 
  isFirebaseOnline,
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc 
};
