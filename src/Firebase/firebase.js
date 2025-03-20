// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeCd82xFLRJUAhssb85IcaYO5nf33yGEs",
  authDomain: "student-application-eece0.firebaseapp.com",
  projectId: "student-application-eece0",
  storageBucket: "student-application-eece0.firebasestorage.app",
  messagingSenderId: "192456290420",
  appId: "1:192456290420:web:169fa36d51aae3d5fb6121",
  measurementId: "G-RL6BW4SCCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app,auth};
