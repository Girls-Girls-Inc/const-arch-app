// Directory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import FileUploadModal from "../components/DirectoryComponents/FileUploadModal";

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
      <button
        className="hamburger-btn_ca d-md-none"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="mobile-dropdown-nav d-md-none">
          <IconButton
            icon="account_circle"
            label="My Profile"
            route="/dashboard"
          />
          <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
          <IconButton icon="folder" label="Directory" route="/directory" />
          <IconButton
            onClick={() => handleLogout(setUser)}
            icon="logout"
            label="Log Out"
          />
          <IconButton icon="settings" label="Settings" route="/settings" />
        </div>
      )}

      <section className="dashboard-container">
        <section className="dashboard-container-lefty d-none d-md-flex">
          <section className="nav-top">
            <IconButton
              icon="account_circle"
              label="My Profile"
              route="/dashboard"
            />
            <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
            <IconButton icon="folder" label="Directory" route="/directory" />
          </section>
          <section className="nav-bottom">
            <IconButton
              onClick={() => handleLogout(setUser)}
              icon="logout"
              label="Log Out"
            />
            <IconButton icon="settings" label="Settings" route="/settings" />
          </section>
        </section>

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <div className="directory-page">
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
    </main>
  );
};

export default Directory;
