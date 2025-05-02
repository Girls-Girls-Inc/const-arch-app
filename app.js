'use strict';

require('dotenv').config();

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//app.use(cors());
//app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend", "dist")));

const userRoutes = require('./backend/routes/user-routes');
const settingsRoutes = require('./backend/routes/settings-routes');
const uploadRoutes = require('./backend/routes/upload-routes');
const directoryRoutes = require('./backend/routes/directory-routes');
const bookmarkRoutes = require('./backend/routes/bookmark-routes');
const uploadDetailsRoutes = require('./backend/routes/upload-details-routes');

app.use('/api', userRoutes.routes);
app.use('/api', settingsRoutes.routes);
app.use('/api', uploadRoutes.routes);
app.use('/api', directoryRoutes.routes);
app.use('/api', bookmarkRoutes.routes);
app.use('/api', uploadDetailsRoutes.routes);

app.get(/.*/, (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, ".", "frontend", "dist") });
});

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  try {
    app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

module.exports = app;