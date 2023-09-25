// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDcMU585doUJjCLK4KzPEl04_yPMQzPi3g",
  authDomain: "dashboard-10e65.firebaseapp.com",
  projectId: "dashboard-10e65",
  storageBucket: "dashboard-10e65.appspot.com",
  messagingSenderId: "44706541337",
  appId: "1:44706541337:web:0d8974bd850222d8b81f88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)