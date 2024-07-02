// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'; // Importovanje auth modul iz firebas-a da bismo mogli da ga koristimo u react aplikaciji
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-_FM9PiDGFN8OdJwir55nRXXFZzf6azY",
  authDomain: "wheel-deal-app-3a1b3.firebaseapp.com",
  projectId: "wheel-deal-app-3a1b3",
  storageBucket: "wheel-deal-app-3a1b3.appspot.com",
  messagingSenderId: "756388902664",
  appId: "1:756388902664:web:0fa44191d2654ce4cadebd"
//   databaseUrl: process.env.REACT_APP_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Ovde pravimo uz getAuth metodu za nass app instancu auth modula
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage};