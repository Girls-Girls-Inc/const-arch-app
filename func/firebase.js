// modules/firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../key/girls-girls-inc-firebase-adminsdk-fbsvc-e1c07102df.json"); // Your service account key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
