import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import "../index.css";
import IconButton from "../components/IconButton";
import FileUploadModal from "../components/DirectoryComponents/FileUploadModal";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import { Toaster } from "react-hot-toast";
import DirectoryBlock from "../components/DirectoryComponents/DirectoryBlock";
import CreateFolderModal from "../components/DirectoryComponents/CreateFolderModal";

const Directory = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setModalStep(1);
    setUploadedFile(null);
  };

  const handleOpenFolderModal = () => setShowFolderModal(true);
  const handleCloseFolderModal = () => setShowFolderModal(false);

  return (
    <main>
      <NavigationComponent />

      <section className="dashboard-container">
        <NavigationDashLeft />
        <section className="dashboard-container-righty">
          <main className="dashboard-details directory-dash">
            <h2 className="right-title">Directory</h2>
            <div>
              <div className="directory-subhead">
                <IconButton
                  onClick={handleOpenModal}
                  icon="upload_file"
                  label="Upload File"
                />
                <IconButton
                  onClick={handleOpenFolderModal}
                  route="/directory"
                  icon="create_new_folder"
                  label="Create Folder"
                />
              </div>

              <div className="folder-container">
                <DirectoryBlock
                  currentFolderId={currentFolderId}
                  setCurrentFolderId={setCurrentFolderId}
                  breadcrumb={breadcrumb}
                  setBreadcrumb={setBreadcrumb}
                />
              </div>
            </div>
          </main>
        </section>
      </section>

      <FileUploadModal
        showModal={showModal}
        handleClose={handleCloseModal}
        modalStep={modalStep}
        setModalStep={setModalStep}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
      />

      <CreateFolderModal
        showModal={showFolderModal}
        handleClose={handleCloseFolderModal}
        currentFolderId={currentFolderId}
        onFolderCreated={() => {
          setCurrentFolderId((id) => (id ? id + "" : null));
        }}
      />

      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
};

export default Directory;
