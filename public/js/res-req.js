import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCo9nryMt5uZYsXxcKL7b9uqcxCQ3L6bV0',
  authDomain: 'cssweng-research-support-hub.firebaseapp.com',
  projectId: 'cssweng-research-support-hub',
  storageBucket: 'cssweng-research-support-hub.appspot.com',
  messagingSenderId: '332020336850',
  appId: '1:332020336850:web:ac748046a1e82e05e0050b',
  measurementId: 'G-PDY7DZ01D3'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded, attaching event listener to form');

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
                    // current user header sign in
                    userNameSpan.textContent = `${userData.fullName}`;
                } else {
                    userNameSpan.textContent = 'Hello, User';
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                userNameSpan.textContent = '';
            }

            // Sign out the user
            authButton.textContent = 'Logout';
            authButton.href = '#';
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

    async function res_req(event) {
        event.preventDefault();  // Prevent the form from submitting the default way

        console.log('Form submission started');

        const title = document.getElementById('title').value;
        const desc = document.getElementById('desc').value;
        const contact = document.getElementById('contact').value;
        const dgMethod = document.getElementById('dg_method').value;
        const typePart = document.getElementById('typeOfParticipation').value;
        const dgLink = document.getElementById('dg_link').value;
        const startDate = document.getElementById('start_date').value;
        const endDate = document.getElementById('end_date').value;

        const user = auth.currentUser;

        if (!user) {
            console.error('No user is signed in');
            alert('You need to be signed in to submit a research request.');
            return;
        }

        const userId = user.uid;

        const newResReq = {
            title,
            desc,
            contact,
            dgMethod,
            typePart,
            dgLink,
            startDate,
            endDate,
            isApproved: false, // Add the isApproved field with default value false
            userId // Include the user's ID
        };

        console.log('Data to be sent to Firestore:', newResReq);

        try {
            // Save the new research request to Firestore
            await addDoc(collection(db, 'research_requests'), newResReq);
            console.log('Research request submitted successfully!');
            alert('Research request submitted successfully!');
            document.getElementById('resReqForm').reset();
        } catch (error) {
            console.error('Failed to submit research request:', error);
            alert('Failed to submit research request: ' + error.message);
        }
    }

    const form = document.getElementById('resReqForm');
    form.addEventListener('submit', res_req);

    document.getElementById('submitReqButton').addEventListener('click', function () {
        console.log('Request button clicked');
    });
});
