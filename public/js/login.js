import { collection, signInWithEmailAndPassword, onAuthStateChanged, auth, db, getDocs, query, where, updateDoc, doc } from '../server/firebase.js'

document.addEventListener('DOMContentLoaded', function () {
  const registerButton = document.getElementById('loginButton')
  registerButton.addEventListener('click', async function (event) {
    await login(event)
  })
})

// Function to handle login
export async function login (event) {
  event.preventDefault()
  console.log('Login started')

  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()

  // Input validation
  if (!email || !password) {
    alert('Email and Password are required.')
    return
  }

  if (!validateEmail(email)) {
    alert('Invalid email format.')
    return
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log('Authenticated User:', user)

    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.error('No user document found for email:', email)
      alert('No user found. Please register first.')
      return
    }

    const userDoc = querySnapshot.docs[0]
    const userRef = doc(db, 'users', userDoc.id)

    console.log('Firestore Document Reference:', userRef.path)

    await updateDoc(userRef, { last_login: Date.now() })

    console.log('User logged in successfully')
    alert('User logged in!!')
    window.location.href = '/'

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already signed in, redirect to home page
        window.location.href = '/'
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    handleAuthError(error) // Ensure this function is called with the correct error object
  }
}

// Function to validate email format
function validateEmail (email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Function to handle authentication errors
function handleAuthError (error) {
  const errorCode = error.code
  let errorMessage

  switch (errorCode) {
    case 'auth/wrong-password':
      errorMessage = 'Incorrect password. Please try again.'
      break
    case 'auth/user-not-found':
      errorMessage = 'No user found with this email. Please check the email or register for an account.'
      break
    case 'auth/invalid-email':
      errorMessage = 'The email address is not valid. Please check and try again.'
      break
    case 'auth/too-many-requests':
      errorMessage = 'Too many failed login attempts. Please try again later.'
      break
    default:
      errorMessage = 'Error: ' + error.message
  }

  alert(errorMessage)
}
=======
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

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const database = firebase.database()

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
  // Define the register function
  function register () {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    auth.signInWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        const user = userCredential.user
        const databaseRef = database.ref()

        const userData = {
          last_login: Date.now()
        }

        return databaseRef.child('users/' + user.uid).update(userData)
      })
      .then(function () {
        alert('User logged in!!')
        window.location.href = '/'
      })
      .catch(function (error) {
        const errorMessage = error.message
        alert(errorMessage)
      })
  }

  document.getElementById('loginButton').addEventListener('click', function () {
    console.log('Login button clicked')
    register()
  })
})
