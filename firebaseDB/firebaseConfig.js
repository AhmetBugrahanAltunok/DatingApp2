import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
 import { initializeApp } from "firebase/auth";
 import { initializeApp } from "firebase/database";
 import { initializeApp } from "firebase/firestore";
 import { initializeApp } from "firebase/functions";
 import { initializeApp } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfE2QYJKPNvaaXDIxUlGQSLHSJez-V-No",
  authDomain: "dateapp-d0658.firebaseapp.com",
  projectId: "dateapp-d0658",
  storageBucket: "dateapp-d0658.appspot.com",
  messagingSenderId: "369307984656",
  appId: "1:369307984656:web:0259d88d48a910f57bfb95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);   
