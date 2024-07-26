import { auth, db, createUserWithEmailAndPassword, collection, addDoc, where, query, getDocs } from '../server/firebase.js'

document.addEventListener('DOMContentLoaded', function () {
  const registerButton = document.getElementById('registerButton')
  registerButton.addEventListener('click', async function (event) {
    await register(event)
  })
})

export async function register (event) {
  event.preventDefault()

  console.log('Registration started')

  const id = document.getElementById('id').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const fullName = document.getElementById('fullName').value
  const isAdmin = 0
  const points = 0

  // Input validation
  if (!id || !email || !password || !fullName) {
    alert('All fields are required.')
    return
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long.')
    return
  }

  if (id.length !== 8) {
    alert('DLSU ID must be 8 characters long.')
    return
  }

  if (!validateEmail(email)) {
    alert('Please use your DLSU email.')
    return
  }

  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('id', '==', id))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      alert('ID is already taken.')
      return
    }
  } catch (error) {
    console.error('Error checking ID in the database:', error)
    alert('Error checking ID in the database: ' + error.message)
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const userData = {
      id,
      email,
      fullName,
      isAdmin,
      points,
      last_login: Date.now()
    }

    await addDoc(collection(db, 'users'), { ...userData, uid: user.uid })
    console.log('User created successfully')
    alert('User Created!!')
    window.location.href = '/login'
  } catch (error) {
    console.error('Failed to create user:', error)
    alert(error.message)
  }
}

function validateEmail (email) {
  const re = /^[^\s@]+@dlsu\.edu\.ph$/
  return re.test(email)
}
