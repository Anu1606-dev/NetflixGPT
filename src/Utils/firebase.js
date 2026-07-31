// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVsuTxSsHfFIyfSSDYa9lGM_GZSvIbQEA",
  authDomain: "netflixgpt-a03a2.firebaseapp.com",
  projectId: "netflixgpt-a03a2",
  storageBucket: "netflixgpt-a03a2.firebasestorage.app",
  messagingSenderId: "334849048388",
  appId: "1:334849048388:web:8713c3f634c806bf2da111",
  measurementId: "G-F96M7K8TW0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);