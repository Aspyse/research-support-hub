import { collection, getDocs, query, where } from '../server/firebase.js';
import { onAuthStateChanged, signOut } from '../server/firebase.js';

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    const userNameSpan = document.getElementById('userName');
    const authButton = document.getElementById('authButton');
    if (user) {
        currentUser = user;
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                userNameSpan.textContent = `${userData.fullName}`;
            } else {
                userNameSpan.textContent = 'Hello, User';
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            userNameSpan.textContent = '';
        }

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
        currentUser = null;
        userNameSpan.textContent = '';
        authButton.textContent = 'Login';
        authButton.href = '/login';
    }
});

async function fetchAndDisplayResearchRequests(query = '', filterBy = 'title') {
    const resReqCollection = collection(db, 'research_requests');
    const resReqSnapshot = await getDocs(resReqCollection);
    const researchList = document.querySelector('.research-list');
    researchList.innerHTML = ''; // Clear existing list

    resReqSnapshot.forEach(doc => {
        const research = doc.data();
        let matchesQuery = false;

        if (filterBy === 'title' && research.title && research.title.toLowerCase().includes(query.toLowerCase())) {
            matchesQuery = true;
        } else if (filterBy === 'description' && research.desc && research.desc.toLowerCase().includes(query.toLowerCase())) {
            matchesQuery = true;
        }

        if (matchesQuery) {
            const researchCard = document.createElement('div');
            researchCard.className = 'research-card';

            researchCard.innerHTML = `
                <span class="type-part">${research.typePart || ''}</span>
                <h3>${research.title || ''}</h3>
                <p>${research.desc || ''}</p>
                <a href="/research-details/${doc.id}?userId=${currentUser ? currentUser.uid : ''}" class="button">Participate</a>
            `;

            researchList.appendChild(researchCard);
        }
    });
}

// Update research summary and fetch data
async function updateResearchSummary() {
    const resReqCollection = collection(db, 'research_requests');
    const resReqSnapshot = await getDocs(resReqCollection);
    const totalProjects = resReqSnapshot.size;
    const researchSummaryElement = document.querySelector('.research-summary h2');
    
    researchSummaryElement.textContent = `${totalProjects} Active Projects`;
    fetchAndDisplayResearchRequests();
}

// Fetch and display research requests on page load
document.addEventListener('DOMContentLoaded', () => {
    updateResearchSummary(); // Update summary and fetch data
    fetchAndDisplayResearchRequests(); // Fetch and display data initially

    // Search functionality
    document.querySelector('.search-button').addEventListener('click', () => {
        const query = document.querySelector('.search-input').value;
        const filterBy = document.querySelector('.dropbtn').getAttribute('data-filter');
        fetchAndDisplayResearchRequests(query, filterBy);
    });

    // Dropdown functionality
    document.querySelectorAll('.dropdown-content a').forEach(item => {
        item.addEventListener('click', (event) => {
            const filterBy = event.target.textContent.toLowerCase();
            document.querySelector('.dropbtn').textContent = `Search By: ${event.target.textContent}`;
            document.querySelector('.dropbtn').setAttribute('data-filter', filterBy);
        });
    });
});
