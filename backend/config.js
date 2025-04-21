'use strict';
const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

// Default values from environment variables or fallbacks
let HOST = process.env.HOST || 'localhost';
let PORT = process.env.PORT || 4000;

const {
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID
} = process.env;

// Removed the assertions because now HOST and PORT can be passed dynamically
// No need to enforce them as environment variables at this point

module.exports = {
    // Getter functions to retrieve host and port
    getHost: () => HOST,
    getPort: () => PORT,

    // Setter functions to allow app.js to update host and port dynamically
    setHost: (newHost) => { HOST = newHost; },
    setPort: (newPort) => { PORT = newPort; },

    url: HOST_URL,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID
    }
};
