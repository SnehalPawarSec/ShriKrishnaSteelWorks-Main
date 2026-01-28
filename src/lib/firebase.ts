// src/lib/firebase.ts

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCxYvG-Z_pKVq1FoetXq0aNrhVCu0Lyp10",
  authDomain: "shrikrishnasteel-34690.firebaseapp.com",
  projectId: "shrikrishnasteel-34690",
  storageBucket: "shrikrishnasteel-34690.firebasestorage.app",
  messagingSenderId: "988665186718",
  appId: "1:988665186718:web:9e7ab2d7089abe0932ee8f",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

try {
  if (typeof window !== "undefined") {
    getAnalytics(app);
  }
} catch {}

void setPersistence(auth, browserLocalPersistence);

export const googleProvider = new GoogleAuthProvider();
export { app };
