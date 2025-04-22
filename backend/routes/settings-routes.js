// backend/routes/settings-routes.js
const express = require('express');
const { router } = require('../controllers/settingsUpdate');  // Import the router directly

const settingsRoutes = express.Router();

// Use the imported router from settingsUpdate.js
settingsRoutes.use('/settings', router);

module.exports = {
    routes: settingsRoutes
};
