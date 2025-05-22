import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCqAYjm-X4Ha-NlIcAI_-w8kNUPQroi79c",
  authDomain: "trello-7fca9.firebaseapp.com",
  projectId: "trello-7fca9",
  storageBucket: "trello-7fca9.firebasestorage.app",
  messagingSenderId: "937929976447",
  appId: "1:937929976447:web:6058a0db70aaacc68b2d4a"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };