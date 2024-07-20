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
