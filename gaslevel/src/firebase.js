// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBq9ePD0q78ow8pMmgZ-MupsIN3gltDPRg",
  authDomain: "lpg-gas-level-detection.firebaseapp.com",
  databaseURL: "https://lpg-gas-level-detection-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lpg-gas-level-detection",
  storageBucket: "lpg-gas-level-detection.appspot.com",
  messagingSenderId: "561346610904",
  appId: "1:561346610904:web:b9b803b4a8125b861779ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);

export { auth, db };
