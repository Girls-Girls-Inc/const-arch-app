"use client";
import React from "react";
import { useEffect, useState } from "react";
import { db } from "../Firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import IconButton from "../components/IconButton";
import Link from "next/link";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

function ManageUploads() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, navigate]);

  const handleDelete = async (uploadId) => {
    if (!confirm("Are you sure you want to delete this upload?")) return;

    try {
      const res = await fetch(`/api/uploads/${uploadId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete upload");

      setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      toast.success("Upload deleted successfully");
    } catch (error) {
      console.error("Error deleting upload:", error);
      toast.error("Error deleting upload");
    }
  };

  useEffect(() => {
    const checkAdminStatusAndFetchUploads = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error("No user signed in");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        toast.loading("Fetching uploads...");
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsAdmin(userData.isAdmin);

          if (userData.isAdmin) {
            const colRef = collection(db, "upload");
            const snapshot = await getDocs(colRef);
            const uploadsList = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                ...data,
                id: docSnap.id,
                filePath: data.filePath,
              };
            });
            setUploads(uploadsList);
            toast.dismiss();
            toast.success("Uploads loaded successfully!");
          }
        } else {
          toast.error("User document not found");
          setIsAdmin(false);
        }
      } catch (error) {
        toast.error(`Failed to fetch uploads: ${error.message}`);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatusAndFetchUploads();
  }, [auth]);

  if (loading)
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

  if (!isAdmin)
    return (
      <div className="alert alert-danger m-4">
        You do not have permission to view this page.
      </div>
    );

  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <NavigationComponent />

      <section className="dashboard-container">
        <NavigationDashLeft />

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <h2 className="right-title">Manage Uploads</h2>

            <div
              className="table-responsive"
              style={{ maxHeight: "65vh", overflowY: "auto" }}
            >
              {uploads.length > 0 ? (
                <table className="table table-striped table-hover table-borderless w-100 rounded-4 overflow-hidden shadow">
                  <thead className="thead-dark bg-dark text-white">
                    <tr>
                      <th scope="col">Delete</th>
                      <th scope="col">File Name</th>
                      <th scope="col">File</th>
                      <th scope="col">Uploaded By</th>
                      <th scope="col">Upload Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((upload) => (
                      <tr key={upload.id}>
                        <td>
                          <button
                            onClick={() => handleDelete(upload.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete"
                          >
                            <i className="material-symbols-outlined">delete</i>
                          </button>
                        </td>
                        <td>{upload.fileName}</td>
                        <td>
                          {upload.filePath ? (
                            <a
                              href={upload.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                              title="Open file"
                            >
                              <i className="material-symbols-outlined">link</i>
                            </a>
                          ) : (
                            <span className="text-muted">No file</span>
                          )}
                        </td>
                        <td>{upload.uploadedBy}</td>
                        <td>{upload.uploadDate}</td>
                        <td>
                          <IconButton
                            route={`/editUpload/${upload.id}`}
                            icon="info"
                            label="Details"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No uploads found</p>
              )}
            </div>
          </main>
        </section>
      </section>
    </main>
  );
}

export default ManageUploads;
