const admin = require('firebase-admin');

const serviceAccountBase64 = process.env.SERVICE_ACCOUNT_KEY;

// Decode base64 and parse JSON
const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
    admin,
    db
};
