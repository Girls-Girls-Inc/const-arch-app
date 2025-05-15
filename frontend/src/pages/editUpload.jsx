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
            // Handle server timestamp
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
      <div className="dashboard-container">
        <NavigationDashLeft />

        <section className="dashboard-container-righty">
          <div className="dashboard-details">
            <h2 className="right-title">Manage Uploads</h2>
            <div className="card shadow-lg border-0">
              <div className="card-body">
                <FileLink
                  filePath={upload.filePath}
                  fileType={upload.fileType}
                />
                <UploadDetails upload={upload} />
              </div>
              <div className="card-footer">
                <IconButton
                  icon="arrow_back"
                  label="Back to Uploads"
                  route="/manageUploads"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
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
      <div className="mb-4 text-center">
        <span className="text-danger">No file URL available</span>
      </div>
    );
  }

  return (
    <div className="mb-4 text-center">
      <div className="d-flex justify-content-center align-items-center gap-3">
        <IconButton
          icon={fileType?.includes("pdf") ? "picture_as_pdf" : "description"}
          label={"Open File"}
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
    </div>
  );
};

const UploadDetails = ({ upload }) => (
  <div className="row">
    <div className="col-md-6">
      <Detail label="ID" value={upload.id} />
      <Detail label="File Name" value={upload.fileName} />
      <Detail label="File Type" value={upload.fileType} />
      <Detail label="Uploaded By" value={upload.uploadedBy ?? "N/A"} />
      <Detail
        label="Upload Date"
        value={new Date(upload.uploadDate).toLocaleString()}
      />
    </div>
    <div className="col-md-6">
      <Detail label="Bookmark Count" value={upload.bookmarkCount ?? "0"} />
      <Detail label="Directory ID" value={upload.directoryId ?? "N/A"} />
      <Detail
        label="Updated At"
        value={upload.updatedAt ? upload.updatedAt.toLocaleString() : "N/A"}
      />
      <Detail label="Visibility" value={upload.visibility ?? "N/A"} />
    </div>
    <div className="col-12 mt-3">
      <strong>Tags:</strong>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {upload.tags?.length > 0 ? (
          upload.tags.map((tag, index) => (
            <span key={index} className="badge bg-secondary">
              {tag}
            </span>
          ))
        ) : (
          <span className="text-muted">No tags</span>
        )}
      </div>
    </div>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="mb-3">
    <strong className="d-block text-muted small">{label}</strong>
    <div className="p-2 bg-light rounded">{value}</div>
  </div>
);

export default EditUpload;
