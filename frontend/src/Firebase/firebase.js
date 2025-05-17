import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0S4dqBkJWRhRY1FQTxCOFeEtz2F74LSU",
  authDomain: "girls-girls-inc.firebaseapp.com",
  projectId: "girls-girls-inc",
  storageBucket: "girls-girls-inc.firebasestorage.app",
  // storageBucket: "girls-girls-inc-bucket",
  messagingSenderId: "717282603854",
  appId: "1:717282603854:web:2189badddb08917f81e41f",
  measurementId: "G-9MENT0139W",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
