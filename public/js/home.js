import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js'
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCo9nryMt5uZYsXxcKL7b9uqcxCQ3L6bV0',
  authDomain: 'cssweng-research-support-hub.firebaseapp.com',
  projectId: 'cssweng-research-support-hub',
  storageBucket: 'cssweng-research-support-hub.appspot.com',
  messagingSenderId: '332020336850',
  appId: '1:332020336850:web:ac748046a1e82e05e0050b',
  measurementId: 'G-PDY7DZ01D3'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

document.addEventListener('DOMContentLoaded', () => {
  // code for session handling
  onAuthStateChanged(auth, async (user) => {
    const userNameSpan = document.getElementById('userName')
    const authButton = document.getElementById('authButton')
    if (user) {
      // User is logged in
      try {
        // Query Firestore to find the user document by email
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('email', '==', user.email))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]
          const userData = userDoc.data()
          // current user header sign in
          userNameSpan.textContent = `${userData.fullName}`
        } else {
          userNameSpan.textContent = ''
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        userNameSpan.textContent = ''
      }

      // change login button to logout
      authButton.textContent = 'Logout'
      authButton.href = '#'
      // Sign out the user
      authButton.addEventListener('click', async (event) => {
        event.preventDefault()
        try {
          await signOut(auth)
          window.location.href = '/login'
        } catch (error) {
          console.error('Sign out error:', error)
        }
      })
    } else {
      // No user is logged in
      userNameSpan.textContent = ''
      authButton.textContent = 'Login'
      authButton.href = '/login'
    }
  })
})
