import { collection, signOut, onAuthStateChanged, auth, db, getDocs, query, where } from '../server/firebase.js'

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
