// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/reference/js
//import 'dotenv/config'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
import { query, where, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCo9nryMt5uZYsXxcKL7b9uqcxCQ3L6bV0',
  authDomain: 'cssweng-research-support-hub.firebaseapp.com',
  databaseURL: 'https://cssweng-research-support-hub-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'cssweng-research-support-hub',
  storageBucket: 'cssweng-research-support-hub.appspot.com',
  messagingSenderId: '332020336850',
  appId: '1:332020336850:web:ac748046a1e82e05e0050b',
  measurementId: 'G-PDY7DZ01D3'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Module Exports
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db, createUserWithEmailAndPassword, collection, addDoc, 
        signInWithEmailAndPassword, onAuthStateChanged, 
        query, where, getDocs, updateDoc, doc, signOut 
      }

