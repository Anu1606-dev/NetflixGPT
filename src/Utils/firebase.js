import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // NEW

const firebaseConfig = {
  apiKey: "AIzaSyAVsuTxSsHfFIyfSSDYa9lGM_GZSvIbQEA",
  authDomain: "netflixgpt-a03a2.firebaseapp.com",
  projectId: "netflixgpt-a03a2",
  storageBucket: "netflixgpt-a03a2.firebasestorage.app",
  messagingSenderId: "334849048388",
  appId: "1:334849048388:web:8713c3f634c806bf2da111",
  measurementId: "G-F96M7K8TW0",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app); // NEW