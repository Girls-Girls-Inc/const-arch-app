const { db } = require("../db"); // Ensure the `db` object is imported from your DB setup

// Function to update upload details
const updateUploadDetails = async (req, res) => {
    try {
        const { id } = req.params; // Firestore document ID
        const { fileName, filePath, tags, visibility } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Missing document ID in URL" });
        }

        const docRef = db.collection("uploads").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Document not found" });
        }

        const updates = {};
        if (fileName !== undefined) updates.fileName = fileName;
        if (filePath !== undefined) updates.filePath = filePath;
        if (Array.isArray(tags)) updates.tags = tags;
        if (visibility !== undefined) updates.visibility = visibility;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No valid fields provided to update." });
        }

        updates.updatedAt = new Date().toISOString(); // Optional timestamp update

        await docRef.update(updates);

        return res.status(200).json({ message: "Upload details updated successfully." });
    } catch (error) {
        console.error("Error updating upload details:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// Function to get upload details
const getUploadDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Missing document ID in URL" });
        }

        const docRef = db.collection("uploads").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Document not found" });
        }

        return res.status(200).json(doc.data());
    } catch (error) {
        console.error("Error retrieving upload details:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// Export both functions for use in routes
module.exports = {
    updateUploadDetails,
    getUploadDetails,
};
