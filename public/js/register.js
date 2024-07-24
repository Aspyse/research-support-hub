import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';
import { auth, db } from '../server/firebase.js';

document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', async function (event) {
        await register(event);
    });
});

export async function register(event) {
    event.preventDefault();

    console.log('Registration started');

    const id = document.getElementById('id').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;

    // Input validation
    if (!id || !email || !password || !fullName) {
        alert('All fields are required.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    if (id.length < 8) {
        alert('ID must be at least 8 characters long.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Invalid email format.');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = {
            id,
            email,
            fullName,
            last_login: Date.now()
        };

        await addDoc(collection(db, 'users'), { ...userData, uid: user.uid });
        console.log('User created successfully');
        alert('User Created!!');
        window.location.href = '/login';
    } catch (error) {
        console.error('Failed to create user:', error);
        alert(error.message);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
