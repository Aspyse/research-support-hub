import {collection, signInWithEmailAndPassword, onAuthStateChanged} from '../server/firebase.js';
import {auth, db, getDocs, query, where, updateDoc, doc} from '../server/firebase.js';


document.addEventListener('DOMContentLoaded', function () {
  const registerButton = document.getElementById('loginButton');
  registerButton.addEventListener('click', async function (event) {
      await login(event);
  });
});


// Function to handle login
export async function login (event) {
  event.preventDefault();
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