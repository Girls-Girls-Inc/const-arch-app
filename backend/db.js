// backend/db.js
const admin = require('firebase-admin');

const serviceAccount = process.env.SERVICE_ACCOUNT_KEY;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
    admin,
    db
};
