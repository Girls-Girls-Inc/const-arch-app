"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import { Toaster, toast } from "react-hot-toast";
import NavigationComponent from "../components/NavigationComponent";
import InputField from "../components/InputField";
import FileUploadModal from "../components/DirectoryComponents/FileUploadModal";

const UpdateRecordPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // assuming route is /update/:id

    // Upload data states
    const [fileName, setFileName] = useState("");
    const [filePath, setFilePath] = useState("");
    const [visibility, setVisibility] = useState("");
    const [tags, setTags] = useState([]);
    const [activeTag, setActiveTag] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_HOST_URL}/upload/upload001`);
                const data = await res.json();
                setFileName(data.fileName || "");
                setFilePath(data.filePath || "");
                setVisibility(data.visibility || "");
                setTags(data.tags || []);
            } catch (error) {
                toast.error("Failed to load upload details");
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/upload/upload001`, {
                method: "PATCH", // use "POST" if that's what your backend expects
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName,
                    filePath,
                    visibility,
                    tags,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Document info saved successfully!");
            } else {
                toast.error(data.error || "Failed to save document info.");
            }
        } catch (error) {
            console.error("Error updating document:", error);
            toast.error("An unexpected error occurred.");
        }
    };


    const handleOpen = (tag) => {
        setActiveTag(tag);
        setShowModal(true);
    };
    const handleClose = () => setShowModal(false);

    return (
        <main>
            <Toaster position="top-center" reverseOrder={false} />
            <NavigationComponent />

            <section className="dashboard-container">
                <section className="dashboard-container-lefty d-none d-md-flex">
                    <section className="nav-top">
                        <IconButton icon="account_circle" label="My Profile" route="/dashboard" />
                        <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
                        <IconButton icon="folder" label="Directory" route="/directory" />
                        <IconButton icon="group" label="Manage Users" route="/manageUsers" />
                    </section>
                    <section className="nav-bottom">
                        <IconButton onClick={() => handleLogout(setUser)} icon="logout" label="Log Out" />
                        <IconButton icon="settings" label="Settings" route="/settings" />
                    </section>
                </section>

                <section className="dashboard-container-righty">
                    <main className="dashboard-details">
                        <h2 className="dashboard-title">Upload Document</h2>

                        <form className="dashboard-details-grid" onSubmit={handleSave}>
                            <InputField
                                type="text"
                                placeholder="File Name"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                icon="mail"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="File Path"
                                value={filePath}
                                onChange={(e) => setFilePath(e.target.value)}
                                icon="folder"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="Visibility (e.g., public/private)"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                icon="visibility"
                                required={false}
                            />

                            {/* Render tags as pills instead of modal placement */}
                            <section>
                                <label>Tags</label>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="tag-pill"
                                            onClick={() => handleOpen(tag)}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="d-flex justify-content-center w-100 mt-4">
                                <IconButton icon="check" label="Save Changes" type="submit" />
                            </div>
                        </form>

                        {/* Modal is conditionally shown */}
                        <FileUploadModal
                            showModal={showModal}
                            handleClose={handleClose}
                            modalStep={modalStep}
                            setModalStep={setModalStep}
                            uploadedFile={uploadedFile}
                            setUploadedFile={setUploadedFile}
                            activeTag={activeTag}
                        />
                    </main>
                </section>
            </section>
        </main>
    );
};

export default UpdateRecordPage;
