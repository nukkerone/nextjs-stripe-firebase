
// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-YpemEvbhqHCDboSmSnmzq72Ezmx1CUg",
  authDomain: "nextjs-stripe-firebase-379913.firebaseapp.com",
  projectId: "nextjs-stripe-firebase-379913",
  storageBucket: "nextjs-stripe-firebase-379913.appspot.com",
  messagingSenderId: "299079104284",
  appId: "1:299079104284:web:2845533577668ed300acd9"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
