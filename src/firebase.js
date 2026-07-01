import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdrCakZ6yCB0lR8656TguuwcSLsp81-0E",
  authDomain: "apec-d4f60.firebaseapp.com",
  projectId: "apec-d4f60",
  storageBucket: "apec-d4f60.firebasestorage.app",
  messagingSenderId: "707788277453",
  appId: "1:707788277453:web:d7cc73273579742067cb84",
  measurementId: "G-EX6RL3YVGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);
