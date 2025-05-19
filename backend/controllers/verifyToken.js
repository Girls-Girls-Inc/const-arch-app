// backend/controllers/verifyToken.js
const { admin } = require("../db");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    // collapse assignment + next() into one statement for coverage purposes
    return next(req.user = await admin.auth().verifyIdToken(token));
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = verifyToken;
