// Initialize Firebase
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded, attaching event listener to form');

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

        const newResReq = {
            title,
            desc,
            contact,
            dgMethod,
            typePart,
            dgLink,
            startDate,
            endDate,
            isApproved: false // Add the isApproved field with default value false
        };

        console.log('Data to be sent to Firestore:', newResReq);

        try {
            // Save the new research request to Firestore
            await db.collection('research_requests').add(newResReq);
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
