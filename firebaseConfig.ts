// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaUaYg6d4thUVrpp9lmC6HBrB7fMy4UkU",
  authDomain: "book-review-app-567a3.firebaseapp.com",
  projectId: "book-review-app-567a3",
  storageBucket: "book-review-app-567a3.appspot.com",
  messagingSenderId: "435150017838",
  appId: "1:435150017838:web:40b0ec045ec732f73756bf",
  measurementId: "G-WKCT30Q2D1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics, app, auth };

