"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../Firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import IconButton from "../components/IconButton";
import Link from "next/link";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

function EditUpload() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error("No upload ID provided");
      setLoading(false);
      return;
    }

    const fetchUpload = async () => {
      try {
        toast.loading("Loading upload details...");
        const docRef = doc(db, "upload", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUpload({
            ...data,
            id: docSnap.id,
            updatedAt: data.updatedAt?.toDate?.() || null,
          });
          toast.success("Upload loaded successfully");
        } else {
          toast.error("Upload not found");
        }
      } catch (error) {
        toast.error(`Failed to load upload: ${error.message}`);
      } finally {
        toast.dismiss();
        setLoading(false);
      }
    };

    fetchUpload();
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!upload) {
    return (
      <div className="alert alert-danger m-4">
        Upload not found. <Link href="/manageUploads">Back to uploads</Link>
      </div>
    );
  }

  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <NavigationComponent />
      <section className="dashboard-container">
        <NavigationDashLeft />
        <section className="dashboard-container-righty">
          <article className="dashboard-details">
            <header>
              <h2 className="right-title">Manage Uploads</h2>
            </header>

            <section className="card shadow-lg border-0">
              <div className="card-body">
                <FileLink filePath={upload.filePath} fileType={upload.fileType} />
                <UploadDetails upload={upload} />
              </div>

              <footer className="card-footer">
                <IconButton
                  icon="edit"
                  label="Edit Details"
                  route={`/editDetails/${upload.id}`}
                />
                <IconButton
                  icon="arrow_back"
                  label="Back to Uploads"
                  route="/manageUploads"
                />
              </footer>
            </section>
          </article>
        </section>
      </section>
    </main>
  );
}

const FileLink = ({ filePath, fileType }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(filePath);
    toast.success("URL copied to clipboard");
  };

  if (!filePath) {
    return (
      <section className="mb-4 text-center">
        <p className="text-danger">No file URL available</p>
      </section>
    );
  }

  return (
    <section className="mb-4 text-center">
      <div className="d-flex justify-content-center align-items-center gap-3">
        <IconButton
          icon={fileType?.includes("pdf") ? "picture_as_pdf" : "description"}
          label="Open File"
          route={filePath}
          target="_blank"
        />
        <button
          onClick={copyToClipboard}
          className="btn btn-sm btn-outline-secondary"
          title="Copy URL"
        >
          <i className="material-symbols-outlined">content_copy</i>
        </button>
      </div>
    </section>
  );
};

const UploadDetails = ({ upload }) => (
  <section className="row">
    <article className="col-md-6">
      <Detail label="ID" value={upload.id} />
      <Detail label="File Name" value={upload.fileName} />
      <Detail label="File Type" value={upload.fileType} />
      <Detail label="Uploaded By" value={upload.uploadedBy ?? "N/A"} />
      <Detail label="Upload Date" value={new Date(upload.uploadDate).toLocaleString()} />
    </article>
    <article className="col-md-6">
      <Detail label="Bookmark Count" value={upload.bookmarkCount ?? "0"} />
      <Detail label="Directory ID" value={upload.directoryId ?? "N/A"} />
      <Detail label="Updated At" value={upload.updatedAt ? upload.updatedAt.toLocaleString() : "N/A"} />
      <Detail label="Visibility" value={upload.visibility ?? "N/A"} />
    </article>
    <section className="col-12 mt-3">
      <strong>Tags:</strong>
      <ul className="d-flex flex-wrap gap-2 mt-2 list-unstyled">
        {upload.tags?.length > 0 ? (
          upload.tags.map((tag, index) => (
            <li key={index}>
              <span className="badge bg-secondary">{tag}</span>
            </li>
          ))
        ) : (
          <li>
            <span className="text-muted">No tags</span>
          </li>
        )}
      </ul>
    </section>
  </section>
);

const Detail = ({ label, value }) => (
  <section className="mb-3">
    <strong className="d-block text-muted small">{label}</strong>
    <div className="p-2 bg-light rounded">{value}</div>
  </section>
);

export default EditUpload;
