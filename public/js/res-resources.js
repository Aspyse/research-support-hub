// Initialize Firebase
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to fetch and display research requests based on a query and filter type
function fetchAndDisplayResearchRequests(query = '', filterBy = 'title') {
    const resReqRef = database.ref('research_requests');
    
    resReqRef.once('value', (snapshot) => {
        const data = snapshot.val();
        const researchList = document.querySelector('.research-list');
        researchList.innerHTML = ''; // Clear existing list

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const research = data[key];

                let matchesQuery = false;
                if (filterBy === 'title' && research.title.toLowerCase().includes(query.toLowerCase())) {
                    matchesQuery = true;
                } else if (filterBy === 'description' && research.desc.toLowerCase().includes(query.toLowerCase())) {
                    matchesQuery = true;
                }

                if (matchesQuery) {
                    const researchCard = document.createElement('div');
                    researchCard.className = 'research-card';
                    
                    researchCard.innerHTML = `
                        <span class="type-part">${research.typePart}</span>
                        <h3>${research.title}</h3>
                        <p>${research.desc}</p>
                        <a href="/research-details/${key}" class="button">Participate</a>
                    `;
                    
                    researchList.appendChild(researchCard);
                }
            }
        }
    });
}

// Update research summary and fetch data
function updateResearchSummary() {
    const researchListElement = document.querySelector('.research-list');
    const researchSummaryElement = document.querySelector('.research-summary h2');

    database.ref('research_requests').on('value', (snapshot) => {
        const researchRequests = snapshot.val();
        const totalProjects = researchRequests ? Object.keys(researchRequests).length : 0;

        // Set the total number of projects
        researchSummaryElement.textContent = `${totalProjects} Active Projects`;

        // Populate the research requests
        researchListElement.innerHTML = ''; // Clear existing list
        for (const [key, request] of Object.entries(researchRequests)) {
            const card = document.createElement('div');
            card.classList.add('research-card');
            card.innerHTML = `
                <span class="type-part">${request.typePart}</span>
                <h3>${request.title}</h3>
                <p>${request.desc}</p>
                <a href="/research-details/${key}" class="button">Participate</a>
            `;
            researchListElement.appendChild(card);
        }
    });
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

