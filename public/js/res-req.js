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

document.addEventListener('DOMContentLoaded', function () {

    function res_req(event) {
        event.preventDefault();  // Prevent the form from submitting the default way

        const title = document.getElementById('title').value;
        const desc = document.getElementById('desc').value;
        const contact = document.getElementById('contact').value;
        const dgMethod = document.getElementById('dg_method').value;
        const typePart = document.getElementById('typeOfParticipation').value
        const dgLink = document.getElementById('dg_link').value;
        const startDate = document.getElementById('start_date').value;
        const endDate = document.getElementById('end_date').value;

        const newResReqId = `resReq_${Date.now()}`;
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

        // Log the data to the console
        console.log('Data to be sent to Firebase:', newResReq);

        const resReqRef = database.ref('research_requests/' + newResReqId);

        resReqRef.set(newResReq)
            .then(() => {
                alert('Research request submitted successfully!');
                document.getElementById('resReqForm').reset();
            })
            .catch((error) => {
                alert('Failed to submit research request: ' + error.message);
            });
    }

    const form = document.getElementById('resReqForm');
    form.addEventListener('submit', res_req);

    document.getElementById('submitReqButton').addEventListener('click', function () {
        console.log('Request button clicked');
    });
});
