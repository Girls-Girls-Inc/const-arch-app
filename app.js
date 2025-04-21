// app.js
const express = require("express");
const path = require("path");
const config = require("./backend/config"); // Import the config
const userRoutes = require("./backend/routes/user-routes"); // Import the user routes

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the frontend dist folder
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// API routes
app.use("/api", userRoutes); // Pass the router directly

// Define a route for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

// Define a route to handle any other paths and serve the index.html
app.get(/.*/, (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "frontend", "dist") });
});

// Start the server with the specified port from the config, fallback to 4000
const PORT = config.getPort() || 4000;
const HOST = config.getHost() || "localhost";

// Start the backend server
app.listen(PORT, HOST, () => {
  console.log(`Backend running at http://${HOST}:${PORT}`);
});
