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
  onAuthStateChanged(auth, async (user) => {
    const userNameSpan = document.getElementById('userName')
    const authButton = document.getElementById('authButton')
    const IDElement = document.getElementById('idNumber')
    const fullNameElement = document.getElementById('fullName')
    const emailElement = document.getElementById('email')

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
          // change the header to the current logged in user
          userNameSpan.textContent = `${userData.fullName}`

          IDElement.textContent = `ID Number: ${userData.id || 'N/A'}`
          fullNameElement.textContent = `Full Name: ${userData.fullName || 'N/A'}`
          emailElement.textContent = `Email: ${userData.email || 'N/A'}`
        } else {
          userNameSpan.textContent = ''
          IDElement.textContent = 'ID Number: N/A'
          fullNameElement.textContent = 'Full Name: N/A'
          emailElement.textContent = 'Email: N/A'
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        userNameSpan.textContent = ''
        IDElement.textContent = 'ID Number: N/A'
        fullNameElement.textContent = 'Full Name: N/A'
        emailElement.textContent = 'Email: N/A'
      }
      // Sign out the user
      authButton.textContent = 'Logout'
      authButton.href = '#' // No need for a URL, it's handled in JS
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
      IDElement.textContent = 'ID Number: N/A'
      fullNameElement.textContent = 'Full Name: N/A'
      emailElement.textContent = 'Email: N/A'
    }
  })
})
