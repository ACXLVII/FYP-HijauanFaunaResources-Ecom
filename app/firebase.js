// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoXKHI8V_-vACIaWl4ROFEF9HK_XlqavY",
  authDomain: "admin-next-ecom.firebaseapp.com",
  projectId: "admin-next-ecom",
  storageBucket: "admin-next-ecom.firebasestorage.app",
  messagingSenderId: "544863257762",
  appId: "1:544863257762:web:f002f3767f2ef017aa03fb",
  measurementId: "G-QKFW3ESNSQ"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDV5EHiZrxk-DlItgHEx_uk6LDiGwoFQk0",
//   authDomain: "hijauan-poc.firebaseapp.com",
//   projectId: "hijauan-poc",
//   storageBucket: "hijauan-poc.firebasestorage.app",
//   messagingSenderId: "1005438059724",
//   appId: "1:1005438059724:web:15a8acebd2eb8ef158ae69"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
const db = getFirestore(app);

export { db };