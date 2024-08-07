import { auth, db, collection, getDocs, query, updateDoc, doc, where, increment, signOut, getDoc, addDoc, deleteDoc,
        ref, uploadBytes, getDownloadURL, storage } from '../server/firebase.js';

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
        for (const doc of querySnapshot.docs) {
            const proof = doc.data();
            const proofItem = document.createElement('div');
            proofItem.classList.add('proof-item');
            
            // Get researchId for the proof
            const researchId = proof.researchId;

            // Create HTML for each proof item
            proofItem.innerHTML = `
                <img src="${proof.proofURL}" alt="Proof of participation" style="width: 200px; height: 200px;">
                <input type="number" class="points-input" data-proof-id="${doc.id}" placeholder="Enter points">
                <button class="submit-points-btn" data-proof-id="${doc.id}" data-user-id="${userId}" data-doc-id="${userDocId}" data-research-id="${researchId}">Submit Points</button>
            `;
            proofsContainer.appendChild(proofItem);
        }
    }

    adminContent.appendChild(proofsContainer);

    // Attach event listeners for newly added buttons
    document.querySelectorAll('.submit-points-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const userDocId = button.getAttribute('data-doc-id');
            const researchId = button.getAttribute('data-research-id');
            const pointsInput = button.previousElementSibling;
            const points = parseInt(pointsInput.value);

            if (!isNaN(points)) {
                try {
                    // Update the user's points and send an email with research details
                    await addPointsToUser(userDocId, points, researchId);
                } catch (error) {
                    console.error('Error adding points or sending email:', error);
                }
            } else {
                alert("Please enter a valid number of points.");
            }
        });
    });
}


async function addPointsToUser(userDocId, points, researchId) {
    try {
        // Fetch the research request document to get the title and requestor's userId
        const requestDocRef = doc(db, 'research_requests', researchId);
        const requestDoc = await getDoc(requestDocRef);

        if (!requestDoc.exists()) {
            throw new Error('Request document does not exist');
        }

        const requestData = requestDoc.data();
        const requestTitle = requestData.title; // Get the request title
        const requestorUserId = requestData.userId; // Get the userId of the requestor

        // Fetch the document for the requestor
        const usersCollectionRef = collection(db, 'users');
        const requestorQuery = query(usersCollectionRef, where('uid', '==', requestorUserId));
        const requestorQuerySnapshot = await getDocs(requestorQuery);

        if (requestorQuerySnapshot.empty) {
            throw new Error('Requestor document does not exist');
        }

        const requestorDoc = requestorQuerySnapshot.docs[0];
        const requestorData = requestorDoc.data();
        const requestorEmail = requestorData.email; // Get the requestor's email

        // Check if requestorEmail is valid
        if (!requestorEmail) {
            throw new Error('Requestor email is missing from the requestor document');
        }

        // Fetch the user's document who received the points
        const userDocRef = doc(db, 'users', userDocId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error('User document does not exist');
        }

        const userData = userDoc.data();
        const userEmail = userData.email; // Get the user email

        // Check if userEmail is valid
        if (!userEmail) {
            throw new Error('User email is missing from the user document');
        }

        // Update the user's points
        await updateDoc(userDocRef, {
            points: increment(points)
        });

        // Send email to the user who received points
        try {
            const userEmailResponse = await fetch('/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: userEmail,
                    subject: `Points Added for Your Participation in "${requestTitle}"`,
                    text: `Dear User,\n\nYou have been awarded ${points} points for your participation in the research titled "${requestTitle}".\n\nBest regards,\nThe Research Support Team`,
                    html: `<p>Dear User,</p><p>You have been awarded <strong>${points}</strong> points for your participation in the research titled "<strong>${requestTitle}</strong>".</p><p>Best regards,<br>The Research Support Hub</p>`
                })
            });

            if (userEmailResponse.ok) {
                console.log('User email sent successfully.');
            } else {
                console.error('Error sending user email:', userEmailResponse.statusText);
            }
        } catch (error) {
            console.error('Error sending user email:', error);
        }

        // Send email to the requestor
        try {
            const requestorEmailResponse = await fetch('/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: requestorEmail,
                    subject: `Points Awarded for Your Research Request "${requestTitle}"`,
                    text: `Dear Researcher,\n\nThe user has been awarded ${points} points for their participation in your research titled "${requestTitle}".\n\nBest regards,\nThe Research Support Team`,
                    html: `<p>Dear Researcher,</p><p>The user has been awarded <strong>${points}</strong> points for their participation in your research titled "<strong>${requestTitle}</strong>".</p><p>Best regards,<br>The Research Support Hub</p>`
                })
            });

            if (requestorEmailResponse.ok) {
                console.log('Requestor email sent successfully.');
            } else {
                console.error('Error sending requestor email:', requestorEmailResponse.statusText);
            }
        } catch (error) {
            console.error('Error sending requestor email:', error);
        }

        alert(`Added ${points} points to the user, notified them via email, and also informed the research requestor.`);
    } catch (error) {
        console.error('Error updating points or sending emails:', error);
    }
    viewAllUsers();
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
            <p>End Date: ${request.endDate}</p>
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
    try {
        // Get the request document
        const requestDocRef = doc(db, 'research_requests', requestId);
        const requestDoc = await getDoc(requestDocRef);
        console.log(requestId);

        if (!requestDoc.exists()) {
            throw new Error('Request document does not exist');
        }

        const requestData = requestDoc.data();
        const userID = requestData.userId;
        const requestTitle = requestData.title; // Get the request title
        console.log(userID);

        // Check if userID is valid
        if (!userID) {
            throw new Error('userID is missing from the request document');
        }

        // Query the users collection to find the document where UID matches userID
        const usersCollectionRef = collection(db, 'users');
        const userQuery = query(usersCollectionRef, where('uid', '==', userID));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            throw new Error('User document does not exist');
        }

        // Assuming there is only one document that matches the query
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const userEmail = userData.email; // Get the user email

        // Check if userEmail is valid
        if (!userEmail) {
            throw new Error('User email is missing from the user document');
        }

        // Update the request status
        await updateDoc(requestDocRef, {
            isApproved: isApproved
        });

        // Send email
        try {
            const emailResponse = await fetch('/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: userEmail,
                    subject: `Your request titled "${requestTitle}" has been ${isApproved}`,
                    text: `Your request titled "${requestTitle}" has been ${isApproved}.`,
                    html: `<p>Your request titled "<strong>${requestTitle}</strong>" has been ${isApproved}.</p>`
                })
            });

            if (emailResponse.ok) {
                console.log('Email sent successfully.');
            } else {
                console.error('Error sending email:', emailResponse.statusText);
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }

        alert(`Request titled "${requestTitle}" ${isApproved} successfully.`);
        viewAllResearchRequests(); // Refresh the request list
    } catch (error) {
        console.error('Error fetching user document:', error);
    }
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

    // Add form for adding a new FAQ
    const addFAQForm = document.createElement('div');
    addFAQForm.classList.add('faq-card');
    addFAQForm.innerHTML = `
        <h3>Add New FAQ</h3>
        <input type="text" id="new-faq-question" placeholder="Question">
        <textarea id="new-faq-answer" placeholder="Answer"></textarea>
        <button id="add-faq-btn">Add FAQ</button>
    `;
    adminContent.appendChild(addFAQForm);

    // Event listener for adding a new FAQ
    document.getElementById('add-faq-btn').addEventListener('click', async () => {
        const question = document.getElementById('new-faq-question').value;
        const answer = document.getElementById('new-faq-answer').value;
        if (question && answer) {
            await addDoc(collection(db, 'faqs'), {
                question: question,
                answer: answer
            });
            alert('FAQ added successfully.');
            editFAQs(); // Refresh the FAQs list
        } else {
            alert('Please fill out both fields.');
        }
    });

    // Fetch and display existing FAQs
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
            <button class="delete-faq-btn" data-doc-id="${doc.id}">Delete FAQ</button>
        `;
        adminContent.appendChild(faqCard);
    });

    // Event listeners for updating and deleting FAQs
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

    document.querySelectorAll('.delete-faq-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const docId = button.getAttribute('data-doc-id');
            const docRef = doc(db, 'faqs', docId);
            await deleteDoc(docRef);
            alert('FAQ deleted successfully.');
            editFAQs(); // Refresh the FAQs list
        });
    });
}

async function editAboutUs() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = ''; // Clear current content

    // Add form for adding a new About Us section
    const addAboutUsForm = document.createElement('div');
    addAboutUsForm.classList.add('about-us-card');
    addAboutUsForm.innerHTML = `
        <h3>Add New About Us Section</h3>
        <input type="text" id="new-about-us-title" placeholder="Title">
        <textarea id="new-about-us-content" placeholder="Content"></textarea>
        <input type="file" id="about-us-image" accept="image/*">
        <button id="add-about-us-btn">Add About Us Section</button>
    `;
    adminContent.appendChild(addAboutUsForm);

    // Event listener for adding a new About Us section
    document.getElementById('add-about-us-btn').addEventListener('click', async () => {
        const title = document.getElementById('new-about-us-title').value;
        const content = document.getElementById('new-about-us-content').value;
        const imageFile = document.getElementById('about-us-image').files[0];

        if (title && content) {
            try {
                let imageURL = '';
                if (imageFile) {
                    // Upload the file to Firebase Storage
                    const storageRef = ref(storage, `about-us/${title}/${imageFile.name}`);
                    const snapshot = await uploadBytes(storageRef, imageFile);

                    // Get the download URL
                    imageURL = await getDownloadURL(snapshot.ref);
                }

                // Save the About Us section to Firestore
                await addDoc(collection(db, 'aboutUs'), {
                    title: title,
                    content: content,
                    imageURL: imageURL || '' // Save image URL if available
                });

                alert('About Us section added successfully.');
                editAboutUs(); // Refresh the About Us list
            } catch (error) {
                console.error('Error adding About Us section:', error);
                alert('Failed to add About Us section.');
            }
        } else {
            alert('Please fill out the title and content fields.');
        }
    });

    // Fetch and display existing About Us sections
    const aboutUsRef = collection(db, 'aboutUs');
    const querySnapshot = await getDocs(aboutUsRef);

    querySnapshot.forEach(docSnapshot => {
        const aboutUs = docSnapshot.data();
        const aboutUsCard = document.createElement('div');
        aboutUsCard.classList.add('about-us-card');
        aboutUsCard.innerHTML = `
            <h3>${aboutUs.title}</h3>
            <p>${aboutUs.content}</p>
            ${aboutUs.imageURL ? `<img src="${aboutUs.imageURL}" alt="About Us Image" style="width: 100px; height: 100px;">` : ''}
            <button class="edit-about-us-btn" data-doc-id="${docSnapshot.id}" data-title="${aboutUs.title}" data-content="${aboutUs.content}" data-image-url="${aboutUs.imageURL}">Edit</button>
            <button class="delete-about-us-btn" data-doc-id="${docSnapshot.id}">Delete About Us Section</button>
        `;
        adminContent.appendChild(aboutUsCard);
    });

    // Event listener for editing About Us sections
    document.querySelectorAll('.edit-about-us-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const docId = button.getAttribute('data-doc-id');
            const title = button.getAttribute('data-title');
            const content = button.getAttribute('data-content');
            const imageURL = button.getAttribute('data-image-url');

            // Open the edit modal
            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h2>Edit About Us Section</h2>
                    <input type="text" id="edit-about-us-title" value="${title}">
                    <textarea id="edit-about-us-content">${content}</textarea>
                    ${imageURL ? `<img src="${imageURL}" alt="Current About Us Image" style="width: 100px; height: 100px;">` : ''}
                    <input type="file" id="edit-about-us-image" accept="image/*">
                    <button id="save-about-us-btn" data-doc-id="${docId}">Save Changes</button>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal functionality
            modal.querySelector('.close-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Save changes event listener
            document.getElementById('save-about-us-btn').addEventListener('click', async () => {
                const newTitle = document.getElementById('edit-about-us-title').value;
                const newContent = document.getElementById('edit-about-us-content').value;
                const newImageFile = document.getElementById('edit-about-us-image').files[0];
                let newImageURL = imageURL;

                try {
                    if (newImageFile) {
                        // Upload the new file to Firebase Storage
                        const storageRef = ref(storage, `about-us/${newTitle}/${newImageFile.name}`);
                        const snapshot = await uploadBytes(storageRef, newImageFile);

                        // Get the download URL
                        newImageURL = await getDownloadURL(snapshot.ref);
                    }

                    // Update the About Us section in Firestore
                    const docRef = doc(db, 'aboutUs', docId);
                    await updateDoc(docRef, {
                        title: newTitle,
                        content: newContent,
                        imageURL: newImageURL || imageURL // Use new image URL if available
                    });

                    alert('About Us section updated successfully.');
                    document.body.removeChild(modal);
                    editAboutUs(); // Refresh the About Us list
                } catch (error) {
                    console.error('Error updating About Us section:', error);
                    alert('Failed to update About Us section.');
                }
            });
        });
    });

    // Event listener for deleting About Us sections
    document.querySelectorAll('.delete-about-us-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const docId = button.getAttribute('data-doc-id');
            const docRef = doc(db, 'aboutUs', docId);
            await deleteDoc(docRef);
            alert('About Us section deleted successfully.');
            editAboutUs(); // Refresh the About Us list
        });
    });
}

// Ensure these functions are globally accessible
window.viewProofs = viewProofs;
window.toggleBan = toggleBan;
window.updateRequestStatus = updateRequestStatus;
window.toggleAdmin = toggleAdmin;
window.editAnnouncements = editAnnouncements;
window.editFAQs = editFAQs;
window.editAboutUs = editAboutUs;
