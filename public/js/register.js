const firebaseConfig = {
  apiKey: 'AIzaSyCo9nryMt5uZYsXxcKL7b9uqcxCQ3L6bV0',
  authDomain: 'cssweng-research-support-hub.firebaseapp.com',
  databaseURL: 'https://cssweng-research-support-hub-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'cssweng-research-support-hub',
  storageBucket: 'cssweng-research-support-hub.appspot.com',
  messagingSenderId: '332020336850',
  appId: '1:332020336850:web:ac748046a1e82e05e0050b',
  measurementId: 'G-PDY7DZ01D3'
};

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const database = firebase.database()

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
  // Define the register function
  function register() {
    const id = document.getElementById('id').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    const fullName = document.getElementById('fullName').value.trim()

    // Input validation
    if (!id || !email || !password || !fullName) {
      alert('All fields are required.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (id.length < 8){
      alert('ID must be at least 8 characters long.');
      return;
    }

    if (!validateEmail(email)) {
      alert('Invalid email format.');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        const user = userCredential.user;
        const databaseRef = database.ref();

        const userData = {
          id,
          email,
          fullName,
          last_login: Date.now()
        };

        return databaseRef.child('users/' + user.uid).set(userData);
      })
      .then(function () {
        alert('User Created!!');
        window.location.href = '/login';
      })
      .catch(function (error) {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  document.getElementById('registerButton').addEventListener('click', function () {
    console.log('Register button clicked');
    register();
  });
});
