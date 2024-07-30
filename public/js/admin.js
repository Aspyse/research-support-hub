import { auth, db, collection, getDocs, query, updateDoc, doc, where, increment, signOut } from '../server/firebase.js';

document.getElementById('view-users-btn').addEventListener('click', viewAllUsers);
document.getElementById('view-requests-btn').addEventListener('click', viewAllResearchRequests);

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

    querySnapshot.forEach(doc => {
        const request = doc.data();
        const requestCard = document.createElement('div');
        requestCard.classList.add('request-card');
        
        const statusColor = request.isApproved === 'approved' ? 'green' : (request.isApproved === 'disapproved' ? 'red' : 'gray');
        
        requestCard.innerHTML = `
            <h3>${request.title}</h3>
            <p>Requested by: ${request.userName}</p>
            <p>Type: ${request.type}</p>
            <p>Status: <span class="status ${request.isApproved}">${request.isApproved}</span></p>
            <button class="update-request-status-btn" data-request-id="${doc.id}" data-status="approved">Approve</button>
            <button class="update-request-status-btn" data-request-id="${doc.id}" data-status="disapproved">Disapprove</button>
        `;
        adminContent.appendChild(requestCard);
    });

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

// Ensure these functions are globally accessible
window.viewProofs = viewProofs;
window.toggleBan = toggleBan;
window.updateRequestStatus = updateRequestStatus;
window.toggleAdmin = toggleAdmin;
