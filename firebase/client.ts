// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7L9OLhmyHc4erX9Z1FGbNWUUgQQHJpq0",
  authDomain: "mockmate-35a85.firebaseapp.com",
  projectId: "mockmate-35a85",
  storageBucket: "mockmate-35a85.firebasestorage.app",
  messagingSenderId: "1038748166708",
  appId: "1:1038748166708:web:cc08271e2fedd7d3acb861",
  measurementId: "G-8FHBEVQRQD",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
