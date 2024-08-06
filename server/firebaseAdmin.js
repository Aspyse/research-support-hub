import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Firebase Admin SDK initialization
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log('Firebase Admin SDK initialized successfully');


const sendNotification = async (registrationToken, title, body, data) => {
    const messageSend = {
        token: registrationToken,
        notification: {
            title: title,
            body: body
        },
        apns: {
            payload: {
                aps: {
                    badge: 42
                }
            }
        },
    };

    console.log("Sending message:", JSON.stringify(messageSend, null, 2));
    await admin.messaging().send(messageSend);

    try {
        const response = await admin.messaging().send(messageSend);
        console.log("Successfully sent message:", response);
    } catch (error) {
        console.error("Error sending message:", error);
    }
};




//example

const registrationToken = 
"ck5grmN9BSnjLZMMTAEV9F:APA91bEkMQCcksWoPri53M2JJH7bmExasHLUdz1P-O5vpH_DG763Xd7WcqzojRQBInhnDKQkkM6TDWAyq8PtVhDQ2tvaooLW5fG7gr-4tEcoyQIVxPAvgdKCdF0UP_P1QDRrKJYXiusM";

export {
    sendNotification
}