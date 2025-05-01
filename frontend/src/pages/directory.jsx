// Directory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import FileUploadModal from "../components/DirectoryComponents/FileUploadModal";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import { Toaster } from "react-hot-toast";
import DirectoryBlock from "../components/DirectoryComponents/DirectoryBlock";

const Directory = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, loading, navigate]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setModalStep(1);
    setUploadedFile(null);
  };

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
                <IconButton icon="arrow_back" label="Back" />
                <div className="upload-buttons">
                  <IconButton
                    onClick={handleOpenModal}
                    icon="upload_file"
                    label="Upload File"
                  />
                  <IconButton
                    route="/directory"
                    icon="create_new_folder"
                    label="Create Folder"
                  />
                </div>
              </div>

              <div className="directory-nav">
                <p className="root-text">Root/ backup/</p>
              </div>

              {/* folders*/}
              <div className="folder-container">
                <DirectoryBlock />
              </div>
            </div>
          </main>
        </section>
      </section>

      {/* Use the modal component */}
      <FileUploadModal
        showModal={showModal}
        handleClose={handleCloseModal}
        modalStep={modalStep}
        setModalStep={setModalStep}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
      />

      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
};

export default Directory;
