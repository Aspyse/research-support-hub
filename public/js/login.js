import { collection, signInWithEmailAndPassword, onAuthStateChanged, auth, db, getDocs, query, where, updateDoc, doc, signOut, 
        messaging, getToken } from '../server/firebase.js'

document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('loginButton')
  loginButton.addEventListener('click', async function (event) {
    await login(event)
  })
})

// Function to handle login
export async function login(event) {
  event.preventDefault()
  console.log('Login started')

  const identifier = document.getElementById('identifier').value.trim()
  const password = document.getElementById('password').value.trim()

  // Input validation
  if (!identifier || !password) {
    alert('ID/Email and Password are required.')
    return
  }

  if (!validateIdentifier(identifier)) {
    alert('Invalid ID/Email format.')
    return
  }

  let email = identifier

  // If the identifier is an ID, find the corresponding email
  if (!validateEmail(identifier)) {
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('id', '==', identifier))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.error('No user document found for ID:', identifier)
        alert('No user found. Please register first.')
        return
      }

      const userDoc = querySnapshot.docs[0]
      email = userDoc.data().email
    } catch (error) {
      console.error('Error fetching user email by ID:', error)
      alert('Error fetching user email. Please try again.')
      return
    }
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
    const userData = userDoc.data()

    console.log('Firestore Document Reference:', userRef.path)

    if (userData.isBanned) {
      console.warn('User is banned:', email)
      await signOut(auth)
      alert('You are banned')
      return
    }

    await checkNotificationPermission();
    await requestNotificationPermission(userDoc.id);
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
  const re = /^[^\s@]+@dlsu\.edu\.ph$/
  return re.test(email)
}

// Function to validate ID format
function validateID(id) {
  const re = /^[0-9]{8,}$/
  return re.test(id)
}

// Function to validate ID or email format
function validateIdentifier(identifier) {
  return validateEmail(identifier) || validateID(identifier)
}

// Function to handle authentication errors
function handleAuthError(error) {
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

// Function for checking notification permission
async function checkNotificationPermission() {
  const permission = Notification.permission;

  if (permission === 'denied') {
    console.log('Notifications permission has been blocked.');
    alert('It looks like you have blocked notifications for this site. Please enable notifications in your browser settings to receive updates.');
  }
}

// Function for requesting notification permission
async function requestNotificationPermission(userId) {
  console.log('Requesting notification permission...');
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      const currentToken = await getToken(messaging, { vapidKey: 'BLF-bVKyCJHXWCdneyoh1awkB_52hifAkXE9fEoxb9LwLefEVT2ORS8-MQqaHhHbA29qnmHoBtu5wr35qiSTBFY' });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { fcmToken: currentToken });
      } else {
        console.log('No registration token available.');
      }
    } else if (permission === 'denied') {
      console.log('Notification permission denied.');
      alert('Notifications permission denied. You may enable notifications in your browser settings.');
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
  }
}
