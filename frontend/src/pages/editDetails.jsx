"use client";
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
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [tags, setTags] = useState("");

  // Read-only fields
  const [uploadedBy, setUploadedBy] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState("");
  const [directoryId, setDirectoryId] = useState("");
  const [visibility, setVisibility] = useState("");

  useEffect(() => {
    const fetchUpload = async () => {
      try {
        const docRef = doc(db, "upload", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUpload(data);
          setFileName(data.fileName || "");
          setFileType(data.fileType || "");
          setTags((data.tags || []).join(", "));
          setUploadedBy(data.uploadedBy || "");
          setUploadDate(new Date(data.uploadDate).toLocaleString());
          setBookmarkCount(data.bookmarkCount ?? "0");
          setDirectoryId(data.directoryId || "N/A");
          setVisibility(data.visibility || "public");
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
      <section className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <section className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </section>
      </section>
    );
  }

  return (
    <main>
      <Toaster position="top-center" />
      <NavigationComponent />
      <section className="dashboard-container">
        <NavigationDashLeft />
        <section className="dashboard-container-righty">
          <article className="dashboard-details">
            <h2 className="right-title">Edit Upload Details</h2>
            <form className="dashboard-details-grid-form" onSubmit={handleUpdate}>
              <section className="dashboard-details-grid">
                <InputField
                  id="fileName"
                  label="File Name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  icon="description"
                />
                <InputField
                  id="fileType"
                  label="File Type"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  icon="article"
                />
                <InputField
                  id="tags"
                  label="Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  icon="sell"
                />

                <p><strong>Uploaded By:</strong> {uploadedBy}</p>
                <p><strong>Upload Date:</strong> {uploadDate}</p>
                <p><strong>Bookmark Count:</strong> {bookmarkCount}</p>
                <p><strong>Directory ID:</strong> {directoryId}</p>
              </section>

              <footer className="d-flex justify-content-center mt-4 gap-3">
                <IconButton icon="save" label="Save Changes" type="submit" />
                <IconButton icon="arrow_back" label="Back to Upload" route={`/editUpload/${id}`} />
              </footer>
            </form>
          </article>
        </section>
      </section>
    </main>
  );
}
