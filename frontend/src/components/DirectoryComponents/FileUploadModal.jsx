import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import IconButton from "../IconButton";
import DropzoneComponent from "./Dropzone";
import { toast } from "react-hot-toast";
import { storage, auth, db } from "../../Firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDocs,
  query,
  where,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import axios from "axios";
const HOST_URL = process.env.VITE_API_HOST_URL || "http://localhost:4001";
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
  const [folderOptions, setFolderOptions] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("default_directory");

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

  useEffect(() => {
    const fetchUserFolders = async () => {
      const userId = auth.currentUser?.email;
      if (!userId) return;

      try {
        const dirRef = collection(db, "directory");
        const q = query(dirRef, where("createdBy", "==", userId));
        const snapshot = await getDocs(q);

        const options = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Untitled Folder",
        }));

        setFolderOptions(options);
      } catch (error) {
        console.error("Error fetching folders:", error);
        toast.error("Failed to load folders");
      }
    };

    if (showModal) fetchUserFolders();
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      setUploadedFile((prev) => ({
        ...prev,
        directoryId: selectedFolder || "default_directory",
      }));
    }
  }, [selectedFolder, showModal, setUploadedFile]);

  useEffect(() => {
    if (!showModal) {
      setTags([]);
      setTagInput("");
      setFilteredTags([]);
      setUploadedFile(null);
      setModalStep(1);
      setSelectedFolder("default_directory");
    }
  }, [showModal, setModalStep, setUploadedFile]);

  const handleNext = () => modalStep < 3 && setModalStep(modalStep + 1);
  const handleBack = () => modalStep > 1 && setModalStep(modalStep - 1);

  const handleFileChange = (e) => {
    const newName = e.target.value;
    setUploadedFile((prev) => ({ ...prev, customName: newName }));
  };

  const handlePreview = () => {
    if (!uploadedFile?.file) return toast.error("No file to preview!");
    const fileURL = URL.createObjectURL(uploadedFile.file);
    const newTab = window.open(fileURL, "_blank");
    newTab ? newTab.focus() : toast.error("Unable to open the file.");
  };

  const handleUpload = async () => {
    if (!uploadedFile?.file) return toast.error("No file selected for upload.");

    const file = uploadedFile.file;
    const customName = uploadedFile.customName || file.name;
    const fileType = file.type;
    const directoryId = uploadedFile?.directoryId || "default_directory";
    const uniqueFileName = `${Date.now()}_${customName.replace(/\s+/g, "_")}`;
    const uid = auth.currentUser?.uid;
    const storageRef = ref(storage, `${uid}/${directoryId}/${uniqueFileName}`);

    try {
      const uploadToast = toast.loading("Uploading file...");

      const snapshot = await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(snapshot.ref);

      const newUpload = new Upload(
        uniqueFileName,
        customName,
        fileURL,
        directoryId,
        auth.currentUser?.email || "anonymous",
        fileType,
        tags,
        new Date(),
        "public",
        0,
        serverTimestamp()
      );

      console.log("Uploading to directoryId:", directoryId);

      await axios.post(`${HOST_URL}/api/upload`, { ...newUpload });

      toast.dismiss(uploadToast);
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
    setFilteredTags(
      input ? availableTags.filter((tag) => tag.includes(input)) : []
    );
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
      setFilteredTags([]);
    } else {
      toast.error(
        tags.includes(tag) ? "Tag already added." : "Only 5 tags allowed."
      );
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  useEffect(() => {
    if (modalStep === 3) {
      setUploadedFile((prev) => ({ ...prev, tags }));
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
        <div className="d-flex justify-content-center mb-3">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={`mx-1 rounded-circle ${modalStep === step ? "bg-custom-secondary" : "bg-custom-blank"
                }`}
              style={{ width: 15, height: 15 }}
            />
          ))}
        </div>

        <div className="d-flex flex-column justify-content-center text-center h-100">
          {modalStep === 1 && (
            <>
              <h4 className="text-uppercase mb-4">Upload File</h4>
              <DropzoneComponent
                setUploadedFile={setUploadedFile}
                uploadedFile={uploadedFile}
              />
            </>
          )}

          {modalStep === 2 && (
            <>
              <h4 className="text-uppercase mb-4">Add Metadata</h4>

              <div className="w-100 mb-3">
                <label className="form-label">Select Folder</label>
                <select
                  className="form-select"
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                >
                  <option value="default_directory">
                    -- default_directory Folder --
                  </option>
                  {folderOptions.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className="w-100 mb-3">
                <label className="form-label">Add Custom Tag</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagChange}
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

              <div className="w-100">
                <label className="form-label">Suggested Tags</label>
                <div className="d-flex flex-wrap">
                  {availableTags.map((tag) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <span
                        key={tag}
                        onClick={() =>
                          isSelected ? removeTag(tag) : addTag(tag)
                        }
                        className={`badge m-1 ${isSelected
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

              {tags.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1">Selected Tags:</p>
                  <div className="d-flex flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
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
              <h4 className="text-uppercase mb-4">View Details</h4>
              <p>
                File:{" "}
                <strong>
                  {uploadedFile?.customName ||
                    uploadedFile?.file?.name ||
                    "No file selected"}
                </strong>
              </p>
              <p>
                Folder:{" "}
                <strong>
                  {folderOptions.find((f) => f.id === selectedFolder)?.name ||
                    "default_directory"}
                </strong>
              </p>
              <div className="d-flex flex-column">
                <p>Tags:</p>
                <div className="d-flex flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
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
