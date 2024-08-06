import { onAuthStateChanged, signOut, auth, db, collection, query, where, getDocs } from '../server/firebase.js'

document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    const userNameSpan = document.getElementById('userName')
    const authButton = document.getElementById('authButton')
    const IDElement = document.getElementById('idNumber')
    const fullNameElement = document.getElementById('fullName')
    const emailElement = document.getElementById('email')
    const pointElement = document.getElementById('points')

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
          console.log(userData.points)

          IDElement.textContent = `ID Number: ${userData.id || 'N/A'}`
          fullNameElement.textContent = `Full Name: ${userData.fullName || 'N/A'}`
          emailElement.textContent = `Email: ${userData.email || 'N/A'}`
          pointElement.textContent = `Points: ${userData.points || 'N/A'}`
        } else {
          userNameSpan.textContent = ''
          IDElement.textContent = 'ID Number: N/A'
          fullNameElement.textContent = 'Full Name: N/A'
          emailElement.textContent = 'Email: N/A'
          pointElement.textContent = `Points: ${userData.points || 'N/A'}`
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        userNameSpan.textContent = ''
        IDElement.textContent = 'ID Number: N/A'
        fullNameElement.textContent = 'Full Name: N/A'
        emailElement.textContent = 'Email: N/A'
        pointElement.textContent = 'Points: N/A'
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
      IDElement.textContent = 'ID Number: N/A'
      fullNameElement.textContent = 'Full Name: N/A'
      emailElement.textContent = 'Email: N/A'
      pointElement.textContent = 'Points: N/A'
    }
  })
})
