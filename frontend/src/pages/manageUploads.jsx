"use client";
import { useEffect, useState } from "react";
import { db } from "../Firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import IconButton from "../components/IconButton";
import Link from "next/link";
import { main } from "@popperjs/core";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import { Toaster, toast } from "react-hot-toast";

function ManageUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  const auth = getAuth();

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
        console.log("No user signed in");
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
                filePath: data.filePath && data.filePath,
              };
            });
            setUploads(uploadsList);
            toast.dismiss();
            toast.success("Uploads loaded successfully!");
          }
        } else {
          console.log("User document not found");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Failed to fetch uploads");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatusAndFetchUploads();
  }, [auth]);

  if (loading) return <p>Loading uploads...</p>;
  if (!isAdmin) return <p>You do not have permission to view this page.</p>;

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
                      <th scope="col" style={{ width: "20%" }}>
                        File Path
                      </th>
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
                          >
                            <i className="material-symbols-outlined">delete</i>
                          </button>
                        </td>
                        <td>{upload.fileName}</td>
                        <td
                          style={{
                            width: "20%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <a
                            href={upload.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {upload.filePath}
                          </a>
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
