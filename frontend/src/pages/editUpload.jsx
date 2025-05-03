"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import IconButton from "../components/IconButton"; 
import Link from "next/link"; // Import Link from Next.js

function EditUpload() {
  const { id } = useParams(); // React Router hook
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUpload = async () => {
      try {
        const docRef = doc(db, "upload", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUpload(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpload();
  }, [id]);

  if (loading) return <p>Loading upload details...</p>;
  if (!upload) return <p>Upload not found.</p>;

  return (
    <main className="dashboard-container">
      {/* Left Sidebar for Dashboard */}
      <Sidebar />

      {/* Main Content Area */}
      <section className="dashboard-container-righty">
        <div className="dashboard-details">
          <h2>Upload Details</h2>
          <FilePreview fileType={upload.fileType} filePath={upload.filePath} />
          <UploadDetails upload={upload} />
        </div>
      </section>
    </main>
  );
}

// Sidebar Component
const Sidebar = () => (
  <section className="dashboard-container-lefty d-none d-md-flex">
    <section className="nav-top">
      <IconButton icon="account_circle" label="My Profile" route="/dashboard" />
      <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
      <IconButton icon="folder" label="Directory" route="/directory" />
      <IconButton icon="group" label="Manage Users" route="/manageUsers" />
      <IconButton icon="upload" label="Manage Uploads" route="/ManageUploads" />
    </section>

    <section className="nav-bottom">
      <IconButton icon="logout" label="Log Out" route="/logout" />
      <IconButton icon="settings" label="Settings" route="/settings" />
    </section>
  </section>
);

// File Preview Component
const FilePreview = ({ fileType, filePath }) => (
  <div style={{ marginBottom: "20px" }}>
    {fileType === "pdf" ? (
      <embed
        src={filePath?.[1]}
        type="application/pdf"
        width="40%"
        height="100px"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      />
    ) : (
      <img
        src={filePath?.[1]}
        alt="Uploaded file"
        style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "8px" }}
      />
    )}
  </div>
);

// Upload Details Component
const UploadDetails = ({ upload }) => (
  <div style={{ textAlign: "left" }}>
    <Detail label="ID" value={upload.id} />
    <Detail label="Bookmark Count" value={upload.bookmarkCount ?? "N/A"} />
    <Detail label="Directory ID" value={upload.directoryId ?? "N/A"} />
    <Detail label="File Name" value={upload.fileName} />
    <Detail label="File Type" value={upload.fileType} />
    <Detail label="Uploaded By" value={upload.uploadedBy ?? "N/A"} />
    <Detail label="Upload Date" value={new Date(upload.uploadDate).toLocaleString()} />
    <Detail label="Updated At" value={new Date(upload.updatedAt).toLocaleString()} />
    <Detail label="Visibility" value={upload.visibility ?? "N/A"} />
    <Detail label="Tags" value={upload.tags?.join(", ") ?? "N/A"} />
    <Detail label="Parent" value={upload.filePath?.[0]?.parent ?? "N/A"} />
    <Detail label="Database Location" value="africa-south1" />
  </div>
);

// Reusable Detail Component
const Detail = ({ label, value }) => (
  <p><strong>{label}:</strong> {value}</p>
);

export default EditUpload;
