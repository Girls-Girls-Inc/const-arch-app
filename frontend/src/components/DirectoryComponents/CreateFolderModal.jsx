import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import IconButton from "../IconButton";
import { db, auth } from "../../Firebase/firebase";
import {
  collection,
  Timestamp,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-hot-toast";

const CreateFolderModal = ({
  showModal,
  handleClose,
  currentFolderId,
  onFolderCreated,
}) => {
  const [folderName, setFolderName] = useState("");
  const [parentId, setParentId] = useState(currentFolderId || null);
  const [userFolders, setUserFolders] = useState([]);

  useEffect(() => {
    if (!showModal) {
      setFolderName("");
      setParentId(currentFolderId || null);
    }
  }, [showModal, currentFolderId]);

  useEffect(() => {
    const fetchUserFolders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const dirRef = collection(db, "directory");
        const q = query(dirRef, where("createdBy", "==", user.email));
        const snapshot = await getDocs(q);

        const foldersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserFolders(foldersList);
      } catch (err) {
        console.error("Error fetching folders for dropdown:", err);
      }
    };

    if (showModal) fetchUserFolders();
  }, [showModal]);

  const handleCreateFolder = async () => {
    const trimmedName = folderName.trim();
    if (!trimmedName) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const customId = crypto.randomUUID();
      const folderData = {
        name: trimmedName,
        createdAt: Timestamp.now(),
        createdBy: user.email || "unknown",
        id: customId,
        parentId: parentId,
      };

      const folderRef = doc(db, "directory", customId);
      await setDoc(folderRef, folderData);

      toast.success("Folder created!");
      handleClose();
      if (onFolderCreated) onFolderCreated();
    } catch (err) {
      console.error("Error creating folder:", err);
      toast.error(`Failed: ${err.message}`);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Create Folder</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="text-center">
          <h4 className="text-uppercase mb-4">New Folder</h4>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <label htmlFor="parentFolderSelect" className="form-label">
            Parent Folder
          </label>
          <select
            id="parentFolderSelect"
            className="form-select"
            value={parentId || ""}
            onChange={(e) => setParentId(e.target.value || null)}
          >
            <option value="">Root (no parent)</option>
            {userFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name || "Untitled Folder"}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <IconButton icon="close" label="Cancel" onClick={handleClose} />
        <IconButton icon="check" label="Create" onClick={handleCreateFolder} />
      </Modal.Footer>
    </Modal>
  );
};

export default CreateFolderModal;
