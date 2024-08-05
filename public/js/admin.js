import { auth, db, collection, getDocs, query, updateDoc, doc, where, increment, signOut, getDoc, addDoc, deleteDoc } from '../server/firebase.js';

// Existing event listeners
document.getElementById('view-users-btn').addEventListener('click', viewAllUsers);
document.getElementById('view-requests-btn').addEventListener('click', viewAllResearchRequests);
document.getElementById('edit-announcements-btn').addEventListener('click', editAnnouncements);
document.getElementById('edit-faqs-btn').addEventListener('click', editFAQs);
document.getElementById('edit-about-us-btn').addEventListener('click', editAboutUs);

async function viewAllUsers() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = ''; // Clear current content
    
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    querySnapshot.forEach(doc => {
        const user = doc.data();
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');

        userCard.innerHTML = `
            <h3>${user.fullName}</h3>
            <p>ID: ${user.id}</p>
            <p>Email: ${user.email}</p>
            <button class="view-proofs-btn" data-user-id="${user.uid}" data-doc-id="${doc.id}">View proofs of participation</button>
            <button class="toggle-ban-btn" data-user-id="${doc.id}" data-is-banned="${user.isBanned}">${user.isBanned ? 'Unban' : 'Ban'}</button>
            <button class="toggle-admin-btn" data-user-id="${doc.id}" data-is-admin="${user.isAdmin}">${user.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>
        `;
        adminContent.appendChild(userCard);
    });

    // Attach event listeners for newly added buttons
    document.querySelectorAll('.view-proofs-btn').forEach(button => {
        button.addEventListener('click', () => viewProofs(button.getAttribute('data-user-id'), button.getAttribute('data-doc-id')));
    });

    document.querySelectorAll('.toggle-ban-btn').forEach(button => {
        button.addEventListener('click', () => toggleBan(button.getAttribute('data-user-id'), button.getAttribute('data-is-banned') === 'true'));
    });

    document.querySelectorAll('.toggle-admin-btn').forEach(button => {
        button.addEventListener('click', () => toggleAdmin(button.getAttribute('data-user-id'), button.getAttribute('data-is-admin') === 'true'));
    });
}

async function viewProofs(userId, userDocId) {
    console.log(`viewProofs called for userId: ${userId}`);
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = ''; // Clear current content

    const proofsRef = collection(db, 'participation_proofs');
    const q = query(proofsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const proofsContainer = document.createElement('div');
    proofsContainer.classList.add('proofs-container');

    if (querySnapshot.empty) {
        console.log(`No proofs found for userId: ${userId}`);
        proofsContainer.innerHTML = `<p>No proofs of participation found for this user.</p>`;
    } else {
        querySnapshot.forEach(doc => {
            const proof = doc.data();
            const proofItem = document.createElement('div');
            proofItem.classList.add('proof-item');
            proofItem.innerHTML = `
                <img src="${proof.proofURL}" alt="Proof of participation" style="width: 200px; height: 200px;">
                <input type="number" class="points-input" data-user-id="${userId}" placeholder="Enter points">
                <button class="submit-points-btn" data-user-id="${userId}" data-proof-id="${doc.id}" data-doc-id="${userDocId}">Submit Points</button>
            `;
            proofsContainer.appendChild(proofItem);
        });
    }

    adminContent.appendChild(proofsContainer);

    // Attach event listeners for newly added buttons
    document.querySelectorAll('.submit-ppoints-btn').forEach(button => {
        button.addEventListener('click', () => {
            const userDocId = button.getAttribute('data-doc-id');
            const pointsInput = button.previousElementSibling;
            const points = parseInt(pointsInput.value);
            if (!isNaN(points)) {
                addPointsToUser(userDocId, points);
            } else {
                alert("Please enter a valid number of points.");
            }
        });
    });
}

async function addPointsToUser(userDocId, points) {
    const userDocRef = doc(db, 'users', userDocId);
    await updateDoc(userDocRef, {
        points: increment(points)
    });
    alert(`Added ${points} points to the user.`);
}

async function toggleBan(userDocId, isBanned) {
    const userDocRef = doc(db, 'users', userDocId);
    await updateDoc(userDocRef, {
        isBanned: !isBanned
    });

    if (!isBanned) {
        // If banning the user, sign them out
        await signOut(auth);
        alert('User banned successfully.');
    } else {
        alert('User unbanned successfully.');
    }
    
    viewAllUsers(); // Refresh the user list
}

async function toggleAdmin(userDocId, isAdmin) {
    const userDocRef = doc(db, 'users', userDocId);
    await updateDoc(userDocRef, {
        isAdmin: !isAdmin
    });
    alert(`User ${!isAdmin ? 'granted' : 'revoked'} admin rights successfully.`);
    viewAllUsers(); // Refresh the user list
}

async function viewAllResearchRequests() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = ''; // Clear current content
    
    const requestsRef = collection(db, 'research_requests');
    const querySnapshot = await getDocs(requestsRef);

    for (const docSnapshot of querySnapshot.docs) {
        const request = docSnapshot.data();
        
        if (!request.userId) {
            console.error('User ID is missing in the research request:', request);
            continue;
        }

        // Fetch the user document using the userId (uid) from the research request
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('uid', '==', request.userId));
        const userSnapshot = await getDocs(userQuery);

        let userFullName = 'Unknown User';
        if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0].data();
            userFullName = userDoc.fullName;
        } else {
            console.error('User document not found for userId:', request.userId);
        }

        const requestCard = document.createElement('div');
        requestCard.classList.add('request-card');
        
        const statusColor = request.isApproved === 'approved' ? 'green' : (request.isApproved === 'disapproved' ? 'red' : 'gray');
        
        requestCard.innerHTML = `
            <h3>${request.title}</h3>
            <p>Description: ${request.desc}</p>
            <p>Requested by: ${userFullName}</p>
            <p>Type: ${request.typePart}</p>
            <p>Start Date: ${request.startDate}</p>
            <p>Start Date: ${request.endDate}</p>
            <p>Status: <span class="status ${statusColor}">${request.isApproved}</span></p>
            <button class="update-request-status-btn" data-request-id="${docSnapshot.id}" data-status="approved">Approve</button>
            <button class="update-request-status-btn" data-request-id="${docSnapshot.id}" data-status="disapproved">Disapprove</button>
        `;
        adminContent.appendChild(requestCard);
    }

    // Attach event listeners for newly added buttons
    document.querySelectorAll('.update-request-status-btn').forEach(button => {
        button.addEventListener('click', () => updateRequestStatus(button.getAttribute('data-request-id'), button.getAttribute('data-status')));
    });
}

async function updateRequestStatus(requestId, isApproved) {
    const requestDocRef = doc(db, 'research_requests', requestId);
    await updateDoc(requestDocRef, {
        isApproved: isApproved
    });
    alert(`Request ${isApproved} successfully.`);
    viewAllResearchRequests(); // Refresh the request list
}

// Function to edit Announcements
async function editAnnouncements() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = ''; // Clear current content

    // Add form for adding a new announcement
    const addAnnouncementForm = document.createElement('div');
    addAnnouncementForm.classList.add('announcement-card');
    addAnnouncementForm.innerHTML = `
        <h3>Add New Announcement</h3>
        <input type="text" id="new-announcement-title" placeholder="Title">
        <textarea id="new-announcement-content" placeholder="Content"></textarea>
        <button id="add-announcement-btn">Add Announcement</button>
    `;
    adminContent.appendChild(addAnnouncementForm);

    // Event listener for adding a new announcement
    document.getElementById('add-announcement-btn').addEventListener('click', async () => {
        const title = document.getElementById('new-announcement-title').value;
        const content = document.getElementById('new-announcement-content').value;
        if (title && content) {
            await addDoc(collection(db, 'announcements'), {
                title: title,
                content: content
            });
            alert('Announcement added successfully.');
            editAnnouncements(); // Refresh the announcements list
        } else {
            alert('Please fill out both fields.');
        }
    });

    // Fetch and display existing announcements
    const announcementsRef = collection(db, 'announcements');
    const querySnapshot = await getDocs(announcementsRef);

    querySnapshot.forEach(doc => {
        const announcement = doc.data();
        const announcementCard = document.createElement('div');
        announcementCard.classList.add('announcement-card');
        announcementCard.innerHTML = `
            <h3>Edit Announcement</h3>
            <input type="text" class="announcement-title" value="${announcement.title}" placeholder="Title">
            <textarea class="announcement-content" placeholder="Content">${announcement.content}</textarea>
            <button class="update-announcement-btn" data-doc-id="${doc.id}">Update Announcement</button>
            <button class="delete-announcement-btn" data-doc-id="${doc.id}">Delete Announcement</button>
        `;
        adminContent.appendChild(announcementCard);
    });

    // Event listeners for updating and deleting announcements
    document.querySelectorAll('.update-announcement-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const docId = button.getAttribute('data-doc-id');
            const title = button.previousElementSibling.previousElementSibling.value;
            const content = button.previousElementSibling.value;
            const docRef = doc(db, 'announcements', docId);
            await updateDoc(docRef, {
                title: title,
                content: content
            });
            alert('Announcement updated successfully.');
        });
    });

    document.querySelectorAll('.delete-announcement-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const docId = button.getAttribute('data-doc-id');
            const docRef = doc(db, 'announcements', docId);
            await deleteDoc(docRef);
            alert('Announcement deleted successfully.');
            editAnnouncements(); // Refresh the announcements list
        });
    });
}

// Function to edit FAQs
async function editFAQs() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = ''; // Clear current content

    const faqsRef = collection(db, 'faqs');
    const querySnapshot = await getDocs(faqsRef);

    querySnapshot.forEach(doc => {
        const faq = doc.data();
        const faqCard = document.createElement('div');
        faqCard.classList.add('faq-card');
        faqCard.innerHTML = `
            <h3>Edit FAQ</h3>
            <input type="text" class="faq-question" value="${faq.question}" placeholder="Question">
            <textarea class="faq-answer" placeholder="Answer">${faq.answer}</textarea>
            <button class="update-faq-btn" data-doc-id="${doc.id}">Update FAQ</button>
        `;
        adminContent.appendChild(faqCard);
    });

    document.querySelectorAll('.update-faq-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const docId = button.getAttribute('data-doc-id');
            const question = button.previousElementSibling.previousElementSibling.value;
            const answer = button.previousElementSibling.value;
            const docRef = doc(db, 'faqs', docId);
            await updateDoc(docRef, {
                question: question,
                answer: answer
            });
            alert('FAQ updated successfully.');
        });
    });
}

// Function to edit About Us
function editAboutUs() {
    window.location.href = '/about-us?edit=true';
}

// Ensure these functions are globally accessible
window.viewProofs = viewProofs;
window.toggleBan = toggleBan;
window.updateRequestStatus = updateRequestStatus;
window.toggleAdmin = toggleAdmin;
window.editAnnouncements = editAnnouncements;
window.editFAQs = editFAQs;
window.editAboutUs = editAboutUs;
