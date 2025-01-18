import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcEr8Jqhj1l7i5pZ9UKl7bUJ5MU1cSO6E",
  authDomain: "angelsadvocate-e77eb.firebaseapp.com",
  projectId: "angelsadvocate-e77eb",
  storageBucket: "angelsadvocate-e77eb.firebasestorage.app",
  messagingSenderId: "439496062633",
  appId: "1:439496062633:web:1f3f5631586f03dfb5dbb8",
  measurementId: "G-YWQG5VH6H8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, GoogleAuthProvider, signInWithPopup, signOut };
