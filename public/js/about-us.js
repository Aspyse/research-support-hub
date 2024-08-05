import { db, collection, getDocs } from '../server/firebase.js'; // Adjust path as needed

document.addEventListener('DOMContentLoaded', async () => {
    const aboutUsContent = document.getElementById('about-us-content');

    try {
        // Fetching About Us documents from Firestore
        const aboutUsRef = collection(db, 'aboutUs');
        const querySnapshot = await getDocs(aboutUsRef);

        querySnapshot.forEach(docSnapshot => {
            const aboutUs = docSnapshot.data();

            if (!aboutUs.imageURL) {
                console.error('Missing image URL for About Us document:', aboutUs);
                return;
            }

            // Creating card for each About Us section
            const aboutUsCard = document.createElement('div');
            aboutUsCard.classList.add('about-us-card');
            aboutUsCard.innerHTML = `
                <h3>${aboutUs.title}</h3>
                <p>${aboutUs.content}</p>
                ${aboutUs.imageURL ? `<img src="${aboutUs.imageURL}" alt="${aboutUs.title}">` : ''}
            `;
            aboutUsContent.appendChild(aboutUsCard);
        });
    } catch (error) {
        console.error('Error fetching About Us documents:', error);
    }
});
