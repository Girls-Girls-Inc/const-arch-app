import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import IconButton from "../IconButton";
import DropzoneComponent from "./Dropzone";
import { toast } from "react-hot-toast";
import { storage, auth, db } from "../../Firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import Upload from "../../../../backend/models/upload";
import axios from "axios";
const HOST_URL = import.meta.env.VITE_API_HOST_URL || "http://localhost:4000";

class Upload {
  constructor(
    id,
    fileName,
    filePath,
    directoryId,
    uploadedBy,
    fileType,
    tags,
    uploadDate,
    visibility,
    bookmarkCount,
    updatedAt
  ) {
    this.id = id;
    this.fileName = fileName;
    this.filePath = filePath;
    this.directoryId = directoryId;
    this.uploadedBy = uploadedBy;
    this.fileType = fileType;
    this.tags = tags;
    this.uploadDate = uploadDate;
    this.visibility = visibility;
    this.bookmarkCount = bookmarkCount;
    this.updatedAt = updatedAt;
  }
}

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
    const fileType = file.type;

    // Add a unique identifier to prevent overwrites
    const uniqueFileName = `${Date.now()}_${customName.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, `files/${uniqueFileName}`);

    console.log(uniqueFileName);
    console.log(storageRef);

    try {
      // Show loading indicator
      const uploadToast = toast.loading("Uploading file...");

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(snapshot.ref);

      console.log(fileURL);

      // Create upload record
      const newUpload = new Upload(
        uniqueFileName,
        customName,
        fileURL,
        "default_directory",
        auth.currentUser?.email || "anonymous",
        fileType,
        tags,
        new Date(),
        "public",
        0,
        serverTimestamp()
      );

      // Save to Firestore
      const response = await axios.post(`${HOST_URL}/api/upload`, {
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

      console.log(response.status);
      console.log(response.data);

      toast.dismiss();
      toast.success("File uploaded successfully!", { duration: 2000 });
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss();
      toast.error(`Upload failed: ${error.message}`, { duration: 3000 });
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

      <Modal.Body
        className="p-4"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
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
              <h4 className="text-uppercase mb-4">Add Metadata</h4>

              {/* File name input */}
              <div className="w-100 mb-3">
                <label className="form-label">File Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    uploadedFile?.customName || uploadedFile?.file?.name || ""
                  }
                  onChange={handleFileChange}
                  placeholder="Enter file name"
                />
              </div>

              {/* Custom tag input */}
              <div className="w-100 mb-3">
                <label className="form-label">Add Custom Tag</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Type and press Enter"
                  className="form-control"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagInput.trim()) {
                      e.preventDefault();
                      addTag(tagInput.trim().toLowerCase());
                    }
                  }}
                />
              </div>

              {/* Suggested tags as clickable bubbles */}
              <div className="w-100">
                <label className="form-label">Suggested Tags</label>
                <div className="d-flex flex-wrap">
                  {availableTags.map((tag, index) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <span
                        key={index}
                        onClick={() =>
                          isSelected ? removeTag(tag) : addTag(tag)
                        }
                        className={`badge m-1 ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                        }`}
                        style={{
                          padding: "0.5rem 0.9rem",
                          borderRadius: "20px",
                          cursor: "pointer",
                          border: isSelected ? "none" : "1px solid #ccc",
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Selected tags */}
              {tags.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1">Selected Tags:</p>
                  <div className="d-flex flex-wrap">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        onClick={() => removeTag(tag)}
                        className="badge bg-secondary m-1"
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                      >
                        {tag}{" "}
                        <span className="ms-2" style={{ fontSize: "12px" }}>
                          &times;
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
