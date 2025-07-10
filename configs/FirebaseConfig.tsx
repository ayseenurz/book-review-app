// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbZYl9zcUYp4WyMeQXFtP9t03tg2GkhKo",
  authDomain: "book-69486.firebaseapp.com",
  projectId: "book-69486",
  storageBucket: "book-69486.firebasestorage.app",
  messagingSenderId: "997847904647",
  appId: "1:997847904647:web:e39ff9633e135cb5f32322",
  measurementId: "G-0MMXQLWP9X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

//const analytics = getAnalytics(app);