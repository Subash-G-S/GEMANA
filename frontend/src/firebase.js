import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrztY8zCaoQp8QAyl8IPMnOuE3sNo5wOA",
  authDomain: "gemana-45363.firebaseapp.com",
  projectId: "gemana-45363",
  storageBucket: "gemana-45363.firebasestorage.app",
  messagingSenderId: "655444340400",
  appId: "1:655444340400:web:d96f2cda0e699f09535575"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);