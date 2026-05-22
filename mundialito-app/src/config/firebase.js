import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1ONt82VhKqUXN0KyB4_ESIG_QljqgR6Q",
  authDomain: "mundialito-app-2c766.firebaseapp.com",
  projectId: "mundialito-app-2c766",
  storageBucket: "mundialito-app-2c766.firebasestorage.app",
  messagingSenderId: "492906201319",
  appId: "1:492906201319:web:79617c104c9527cff76242"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);                