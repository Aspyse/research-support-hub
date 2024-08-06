// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/reference/js
// import 'dotenv/config'

// firebase-app
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js'

// firebase-auth
import {
  getAuth,
  signInWithEmailAndPassword, onAuthStateChanged, signOut,
  createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'

// firebase-firestore
import {
  getFirestore, collection, addDoc,
  query, where, getDocs, getDoc, updateDoc, doc, increment, deleteDoc
} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js'

// firebase-firestore
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js'

// firebase-messaging
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js'


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
const storage = getStorage(app)
const messaging = getMessaging(app)


onMessage(messaging, (payload) => {
    console.log("Message received in foreground: ", payload);
    const { title, body } = payload.notification;
    new Notification(title, {
        body: body,
    });
});


export {
  auth, db, createUserWithEmailAndPassword, collection, addDoc,
  signInWithEmailAndPassword, onAuthStateChanged,
  query, where, getDocs, getDoc, updateDoc, doc, signOut, storage,
  ref, uploadBytes, getDownloadURL, increment, deleteDoc, 
  messaging, getToken, onMessage
}
