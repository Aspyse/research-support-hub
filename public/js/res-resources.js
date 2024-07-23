import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: 'AIzaSyCo9nryMt5uZYsXxcKL7b9uqcxCQ3L6bV0',
    authDomain: 'cssweng-research-support-hub.firebaseapp.com',
    projectId: 'cssweng-research-support-hub',
    storageBucket: 'cssweng-research-support-hub.appspot.com',
    messagingSenderId: '332020336850',
    appId: '1:332020336850:web:ac748046a1e82e05e0050b',
    measurementId: 'G-PDY7DZ01D3'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
                <a href="/research-details/${doc.id}" class="button">Participate</a>
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
