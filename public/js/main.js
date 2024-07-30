import { auth, db, collection, query, where, getDocs } from '../server/firebase.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded event triggered');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log('User is logged in:', user.uid);

            try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    console.log('User document found');
                    querySnapshot.forEach((doc) => {
                        console.log('User document data:', doc.data());
                        if (doc.data().isAdmin === 1) {
                            console.log('User is an admin');
                        } else {
                            console.log('User is not an admin');
                            hideAdminLink();
                        }
                    });
                } else {
                    console.log('No user document found for user:', user.uid);
                    hideAdminLink();
                }
            } catch (error) {
                console.error('Error fetching user document:', error);
                hideAdminLink();
            }
        } else {
            console.log('No user is logged in');
            hideAdminLink();
        }
    });

    function hideAdminLink() {
        const adminLink = document.querySelector('a[href="/admin"]');
        if (adminLink) {
            adminLink.style.display = 'none';
            console.log('Admin link hidden');
        } else {
            console.log('Admin link not found');
        }
    }
});
