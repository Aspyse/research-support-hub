import { collection, signOut, onAuthStateChanged, auth, db, getDocs, query, where } from '../server/firebase.js'

document.addEventListener('DOMContentLoaded', () => {
  // Code for session handling
  onAuthStateChanged(auth, async (user) => {
    const userNameSpan = document.getElementById('userName');
    const authButton = document.getElementById('authButton');

    if (user) {
      // User is logged in
      try {
        // Query Firestore to find the user document by email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          // Current user header sign in
          userNameSpan.textContent = `${userData.fullName}`;
        } else {
          userNameSpan.textContent = '';
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        userNameSpan.textContent = '';
      }

      // Change login button to logout
      authButton.textContent = 'Logout';
      authButton.href = '#';
      // Sign out the user
      authButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          await signOut(auth);
          window.location.href = '/login';
        } catch (error) {
          console.error('Sign out error:', error);
        }
      });
    } else {
      // No user is logged in
      userNameSpan.textContent = '';
      authButton.textContent = 'Login';
      authButton.href = '/login';
    }
  });

  // Load announcements
  async function loadAnnouncements() {
    const announcementsContainer = document.getElementById('announcements-container');
    announcementsContainer.innerHTML = ''; // Clear existing content

    try {
      const announcementsRef = collection(db, 'announcements');
      const querySnapshot = await getDocs(announcementsRef);

      querySnapshot.forEach(doc => {
        const announcement = doc.data();
        const announcementElement = document.createElement('div');
        announcementElement.classList.add('announcement-item');
        announcementElement.innerHTML = `
          <h2>${announcement.title}</h2>
          <p>${announcement.content}</p>
        `;
        announcementsContainer.appendChild(announcementElement);
      });
    } catch (error) {
      console.error('Error loading announcements:', error);
      announcementsContainer.innerHTML = '<p>Error loading announcements.</p>';
    }
  }

  loadAnnouncements();
});
