var firebaseConfig = {
    apiKey: 'AIzaSyCo9nryMt5uZYsXxcKL7b9uqcxCQ3L6bV0',
    authDomain: 'cssweng-research-support-hub.firebaseapp.com',
    databaseURL: 'https://cssweng-research-support-hub-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'cssweng-research-support-hub',
    storageBucket: 'cssweng-research-support-hub.appspot.com',
    messagingSenderId: '332020336850',
    appId: '1:332020336850:web:ac748046a1e82e05e0050b',
    measurementId: 'G-PDY7DZ01D3'
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth()
  const database = firebase.database()
  
 
function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is incorrect')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        id: id,
        email : email,
        full_name : full_name,
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      alert('User Logged In!!')

      // Redirect to the home page
      window.location.href = '/';
  
    })
    .catch(function(error) {
      // use this to alert errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }

  
// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}