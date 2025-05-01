import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import IconButton from "../IconButton";
import DropzoneComponent from "./Dropzone";
import { toast } from "react-hot-toast";
import { storage, auth, db } from "../../Firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Upload from "../../../../backend/models/upload";

const FileUploadModal = ({
  showModal,
  handleClose,
  modalStep,
  setModalStep,
  uploadedFile,
  setUploadedFile,
}) => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);

  const availableTags = [
    "legal",
    "policy",
    "guidelines",
    "archive",
    "constitution",
    "laws",
    "report",
    "research",
    "publications",
  ];

  // Reset all states when modal is closed
  useEffect(() => {
    if (!showModal) {
      setTags([]);
      setTagInput("");
      setFilteredTags([]);
      setUploadedFile(null); // Reset the uploaded file
      setModalStep(1); // Reset to the first step
    }
  }, [showModal, setModalStep, setUploadedFile]);

  const handleNext = () => {
    if (modalStep < 3) setModalStep(modalStep + 1);
  };

  const handleBack = () => {
    if (modalStep > 1) setModalStep(modalStep - 1);
  };

  const handleFileChange = (e) => {
    const newName = e.target.value;
    setUploadedFile((prev) => ({
      ...prev,
      customName: newName,
    }));
  };

  const handlePreview = () => {
    if (!uploadedFile?.file) {
      toast.error("No file to preview!");
      return;
    }
    const fileURL = URL.createObjectURL(uploadedFile.file);

    const newTab = window.open(fileURL, "_blank");
    if (newTab) {
      newTab.focus();
    } else {
      toast.error("Unable to open the file in a new tab.");
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile?.file) {
      toast.error("No file selected for upload.");
      return;
    }

    const file = uploadedFile.file;
    const customName = uploadedFile.customName || file.name;
    const fileType = file.type; // Get the file type (MIME type)
    const storageRef = ref(storage, `files/${customName}`);

    try {
      // Upload the file to Firebase storage
      const snapshot = await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(snapshot.ref());

      // Create an instance of the Upload class with the required fields
      const newUpload = new Upload(
        snapshot.ref.name, // id (use snapshot name or generate your own ID)
        customName, // fileName
        fileURL, // filePath (link to the uploaded file)
        "default_directory", // directoryId (you can customize this or pass as a prop)
        auth.currentUser?.email || "anonymous", // uploadedBy
        fileType, // fileType
        uploadedFile.tags || [], // tags
        new Date(), // uploadDate
        "public", // visibility (you can set this based on your use case)
        0, // bookmarkCount
        serverTimestamp() // updatedAt
      );

      // Save the upload data to Firestore
      const docRef = await addDoc(collection(db, "uploads"), {
        id: newUpload.id,
        fileName: newUpload.fileName,
        filePath: newUpload.filePath,
        directoryId: newUpload.directoryId,
        uploadedBy: newUpload.uploadedBy,
        fileType: newUpload.fileType,
        tags: newUpload.tags,
        uploadDate: newUpload.uploadDate,
        visibility: newUpload.visibility,
        bookmarkCount: newUpload.bookmarkCount,
        updatedAt: newUpload.updatedAt,
      });

      toast.success("File uploaded and saved!");
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Try again.");
    }
  };

  const handleTagChange = (e) => {
    const input = e.target.value.toLowerCase();
    setTagInput(input);
    if (input) {
      const filtered = availableTags.filter((tag) =>
        tag.toLowerCase().includes(input)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prevTags) => [...prevTags, tag]);
      setTagInput("");
      setFilteredTags([]);
    } else if (tags.length >= 5) {
      toast.error("You can only add up to 5 tags.");
    } else if (tags.includes(tag)) {
      toast.error("Tag already added.");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  useEffect(() => {
    if (modalStep === 3) {
      setUploadedFile((prev) => ({
        ...prev,
        tags: tags, // Include tags when proceeding to step 3
      }));
    }
  }, [tags, modalStep, setUploadedFile]);

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Upload Process</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4" style={{ height: "400px" }}>
        {/* Step indicators */}
        <div className="d-flex justify-content-center mb-3">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={`mx-1 rounded-circle ${
                modalStep === step ? "bg-custom-secondary" : "bg-custom-blank"
              }`}
              style={{ width: 15, height: 15 }}
            ></span>
          ))}
        </div>

        {/* Step content */}
        <div className="d-flex flex-column justify-content-center text-center h-100">
          {modalStep === 1 && (
            <>
              <h4 className="text-uppercase mb-4">Upload File</h4>{" "}
              {/* Heading for Step 1 */}
              <DropzoneComponent
                setUploadedFile={setUploadedFile}
                uploadedFile={uploadedFile}
              />
            </>
          )}

          {modalStep === 2 && (
            <>
              <h4 className="text-uppercase mb-4">Add Metadata</h4>{" "}
              {/* Tags input field */}
              <div className="d-flex flex-column align-items-start mt-3 w-100">
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagChange}
                  placeholder="Add tags (Press Enter to add)"
                  className="form-control mb-2"
                  onKeyUp={(e) => {
                    if (e.key === "Enter" && tagInput) {
                      addTag(tagInput);
                    }
                  }}
                />

                {/* Suggestions */}
                {filteredTags.length > 0 && (
                  <div className="mt-2">
                    <ul className="list-group">
                      {filteredTags.map((tag, index) => (
                        <li
                          key={index}
                          className="list-group-item list-group-item-action"
                          onClick={() => addTag(tag)}
                          style={{ cursor: "pointer" }}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Selected tags */}
                <div className="d-flex flex-wrap mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="badge bg-secondary m-1 d-flex"
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <span
                        className="ms-2"
                        style={{ fontSize: "12px", cursor: "pointer" }}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {modalStep === 3 && (
            <>
              <h4 className="text-uppercase mb-4">View Details</h4>{" "}
              {/* Heading for Step 3 */}
              <p>
                Ready to upload:{" "}
                <strong>
                  {uploadedFile?.customName ||
                    uploadedFile?.file?.name ||
                    "No file selected"}
                </strong>
              </p>
              <div className="d-flex flex-column">
                <p>Tags:</p>
                <div className="d-flex flex-wrap">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge bg-custom-secondary m-1"
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: "20px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-center mt-3 w-1/2">
                <IconButton
                  icon="check"
                  label="Confirm"
                  onClick={handleUpload}
                  className="me-2"
                />
                <IconButton
                  icon="download"
                  label="Preview"
                  onClick={handlePreview}
                  className="me-2"
                />
                <IconButton icon="close" label="Cancel" onClick={handleClose} />
              </div>
            </>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        {modalStep > 1 && (
          <IconButton icon="arrow_back" label="Back" onClick={handleBack} />
        )}
        {modalStep < 3 && (
          <IconButton icon="arrow_forward" label="Next" onClick={handleNext} />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FileUploadModal;
