import { auth, db, collection, doc, getDoc, getDocs, updateDoc, query, where } from '../server/firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('save-faq-btn');
    const cancelBtn = document.getElementById('cancel-faq-btn');
    const modal = document.getElementById('edit-faq-modal');
    const questionInput = document.getElementById('faq-question');
    const answerTextarea = document.getElementById('faq-answer');
    const faqContent = document.getElementById('faq-content');

    // Function to hide the edit buttons if the user is not an admin
    async function checkAdminStatus(user) {
        const editButtons = document.querySelectorAll('.edit-faq-btn');

        if (user) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uid', '==', user.uid));
            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    if (userData.isAdmin === 1) {
                        // User is admin, so display the edit buttons
                        editButtons.forEach(button => {
                            button.style.display = 'inline-block';
                        });
                    } else {
                        // User is not admin, so hide the edit buttons
                        editButtons.forEach(button => {
                            button.style.display = 'none';
                        });
                    }
                } else {
                    editButtons.forEach(button => {
                        button.style.display = 'none';
                    });
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                editButtons.forEach(button => {
                    button.style.display = 'none';
                });
            }
        } else {
            editButtons.forEach(button => {
                button.style.display = 'none';
            });
        }
    }

    // Load FAQs from Firestore
    async function loadFAQs() {
        const faqsRef = collection(db, 'faqs');
        try {
            const querySnapshot = await getDocs(faqsRef);
            faqContent.innerHTML = ''; // Clear existing content

            querySnapshot.forEach((doc) => {
                const faq = doc.data();
                const faqItem = document.createElement('div');
                faqItem.classList.add('faq-item');
                faqItem.innerHTML = `
                    <h3>${faq.question}</h3>
                    <p>${faq.answer}</p>
                    <button class="edit-faq-btn" data-doc-id="${doc.id}" style="display: none;">Edit</button>
                `;
                faqContent.appendChild(faqItem);
            });

            // Attach event listeners for the edit buttons
            document.querySelectorAll('.edit-faq-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const docId = button.getAttribute('data-doc-id');
                    openEditModal(docId);
                });
            });

            // Check admin status after loading FAQs
            auth.onAuthStateChanged(user => {
                checkAdminStatus(user);
            });

        } catch (error) {
            console.error('Error loading FAQs:', error);
        }
    }

    function openEditModal(docId) {
        // Fetch FAQ details and populate the modal
        async function fetchAndPopulate() {
            const docRef = doc(db, 'faqs', docId);
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const faq = docSnap.data();
                    questionInput.value = faq.question;
                    answerTextarea.value = faq.answer;
                    modal.style.display = 'block';

                    saveBtn.onclick = async () => {
                        const newQuestion = questionInput.value;
                        const newAnswer = answerTextarea.value;
                        await updateDoc(docRef, {
                            question: newQuestion,
                            answer: newAnswer
                        });
                        alert('FAQ updated successfully.');
                        modal.style.display = 'none';
                        loadFAQs(); // Reload the FAQs to reflect changes
                    };

                    cancelBtn.onclick = () => {
                        modal.style.display = 'none';
                    };
                }
            } catch (error) {
                console.error('Error fetching FAQ:', error);
            }
        }
        fetchAndPopulate();
    }

    // Initial load of FAQs
    loadFAQs();
});
