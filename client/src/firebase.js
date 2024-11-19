// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernblog-611d4.firebaseapp.com",
  projectId: "mernblog-611d4",
  storageBucket: "mernblog-611d4.firebasestorage.app",
  messagingSenderId: "119697331874",
  appId: "1:119697331874:web:21cf3b0734f9fd0ed429fb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);