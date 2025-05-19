"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { toast, Toaster } from "react-hot-toast";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import InputField from "../components/InputField";
import IconButton from "../components/IconButton";

export default function EditUploadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [directoryId, setDirectoryId] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const fetchUpload = async () => {
      try {
        const docRef = doc(db, "upload", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFileName(data.fileName || "");
          setFileType(data.fileType || "");
          setUploadedBy(data.uploadedBy || "");
          setUploadDate(data.uploadDate || "");
          setBookmarkCount(data.bookmarkCount || 0);
          setDirectoryId(data.directoryId || "");
          setUpdatedAt(data.updatedAt?.toDate?.() || null);
          setVisibility(data.visibility || "public");
          setTags((data.tags || []).join(", "));
        } else {
          toast.error("Upload not found");
          navigate("/manageUploads");
        }
      } catch (err) {
        toast.error("Failed to fetch upload: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpload();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "upload", id);
      await updateDoc(docRef, {
        fileName,
        fileType,
        uploadedBy,
        uploadDate,
        bookmarkCount: Number(bookmarkCount),
        directoryId,
        visibility,
        tags: tags.split(",").map((tag) => tag.trim()),
        updatedAt: Timestamp.now(),
      });
      toast.success("Upload details updated");
      navigate(`/editUpload/${id}`);
    } catch (err) {
      toast.error("Update failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Toaster position="top-center" />
      <NavigationComponent />
      <div className="dashboard-container">
        <NavigationDashLeft />
        <section className="dashboard-container-righty">
          <div className="dashboard-details">
            <h2 className="right-title">Edit Upload Details</h2>
            <form className="dashboard-details-grid-form" onSubmit={handleUpdate}>
              <div className="dashboard-details-grid">
                <InputField id="fileName" label="File Name" value={fileName} onChange={(e) => setFileName(e.target.value)} icon="description" />
                <InputField id="fileType" label="File Type" value={fileType} onChange={(e) => setFileType(e.target.value)} icon="article" />
                <InputField id="uploadedBy" label="Uploaded By" value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} icon="person" />
                <InputField id="uploadDate" label="Upload Date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} icon="event" />
                <InputField id="bookmarkCount" label="Bookmark Count" type="number" value={bookmarkCount} onChange={(e) => setBookmarkCount(e.target.value)} icon="bookmark" />
                <InputField id="directoryId" label="Directory ID" value={directoryId} onChange={(e) => setDirectoryId(e.target.value)} icon="folder" />
                <InputField id="tags" label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} icon="sell" />
                <div className="form-group">
                  <label htmlFor="visibility" className="form-label">Visibility</label>
                  <select
                    id="visibility"
                    name="visibility"
                    className="form-select"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-4 gap-3">
                <IconButton icon="save" label="Save Changes" type="submit" />
                <IconButton icon="arrow_back" label="Back to Upload" route={`/editUpload/${id}`} />
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
