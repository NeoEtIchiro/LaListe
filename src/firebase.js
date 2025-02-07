// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW-_2xvM9jXQWzwWM5rAHx31ajxeeaEgc",
  authDomain: "gestion-projets-et-chantiers.firebaseapp.com",
  projectId: "gestion-projets-et-chantiers",
  storageBucket: "gestion-projets-et-chantiers.firebasestorage.app",
  messagingSenderId: "501365444073",
  appId: "1:501365444073:web:8e9f184bcca2d1b8984f78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };