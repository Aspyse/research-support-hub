import { auth, db, collection, getDocs, query, where, onAuthStateChanged, signOut } from '../server/firebase.js';

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

    // Fetch and display research requests
    fetchAndDisplayResearchRequests();
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

        if (matchesQuery && research.isApproved === 'approved') {
            const researchCard = document.createElement('div');
            researchCard.className = 'research-card';
            researchCard.setAttribute('data-user-id', research.userId);

            researchCard.innerHTML = `
                <span class="type-part">${research.typePart || ''}</span>
                <h3>${research.title || ''}</h3>
                <p>${research.desc || ''}</p>
                <div class="button-container">
                    ${research.userId === (currentUser ? currentUser.uid : '') 
                        ? `<a href="/edit-research/${doc.id}" class="button">Edit</a>`
                        : `<a href="/res-details/${doc.id}?userId=${currentUser ? currentUser.uid : ''}" class="button">Participate</a>`
                    }
                </div>
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

    // Count the number of approved research requests
    const approvedCount = resReqSnapshot.docs.filter(doc => doc.data().isApproved === 'approved').length;

    const researchSummaryElement = document.querySelector('.research-summary h2');
    researchSummaryElement.textContent = `${approvedCount} Approved Projects`;
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
