import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyArXYlQLv6Q5-jqfhujFS10MY-O2t42nrw",
  authDomain: "collabset-b23d4.firebaseapp.com",
  databaseURL: "https://collabset-b23d4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "collabset-b23d4",
  storageBucket: "collabset-b23d4.firebasestorage.app",
  messagingSenderId: "888772404226",
  appId: "1:888772404226:web:acc511a2fb1b7d47dbf31b",
  measurementId: "G-5XRJWHF3J5"
};

// Initialize Firebase using Modular SDK
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
