"use client";
import { useEffect, useState } from "react";
import { db } from "../Firebase/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import IconButton from "../components/IconButton"; 
import Link from "next/link"; // Import Link from Next.js

function ManageUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true); // Keep track of loading status
  const [isAdmin, setIsAdmin] = useState(null); // Track admin status
  const auth = getAuth();


  const handleDelete = async (uploadId) => {
    if (!confirm("Are you sure you want to delete this upload?")) return;
  
    try {
      const res = await fetch(`/api/uploads/${uploadId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Failed to delete upload");
  
      // Remove deleted item from state
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
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsAdmin(userData.isAdmin);

          if (userData.isAdmin) {
            // Fetch uploads only if user is admin
            console.log("Fetching uploads...");
            const colRef = collection(db, "upload");
            const snapshot = await getDocs(colRef);
            console.log("Snapshot size:", snapshot.size); // Log snapshot size
            const uploadsList = snapshot.docs.map((docSnap) => {
              console.log("Doc data:", docSnap.data()); // Log document data
              const data = docSnap.data();
              return {
                ...data,
                id: docSnap.id,
                filePath: data.filePath && data.filePath//[1], // Assuming you want the second entry from the array
              };
            });
            setUploads(uploadsList);
            console.log("Final uploadsList:", uploadsList); // Log final uploads list
          }
        } else {
          console.log("User document not found");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatusAndFetchUploads();
  }, [auth]);

  if (loading) return <p>Loading uploads...</p>;
  if (!isAdmin) return <p>You do not have permission to view this page.</p>; // Only show uploads for admins

  return (
    <main className="dashboard-container">
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

      <section className="dashboard-container-righty">
        <main className="dashboard-details">
          <h2>Uploads</h2>
          {uploads.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Delete</th>
                  <th>File Name</th>
                  <th>File Path</th>
                  <th>Uploaded By</th>
                  <th>Upload Date</th>
                  <th>Actions</th> {/* NEW column */}
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => (
                  <tr key={upload.id}>
                    <td>
                      <button onClick={() => handleDelete(upload.id)} className="delete-btn">
                        🗑️
                      </button>
                    </td>
                    <td>{upload.fileName}</td>
                    <td>
                      <a href={upload.filePath} target="_blank" rel="noopener noreferrer">
                        {upload.filePath}
                      </a>
                    </td>
                    <td>{upload.uploadedBy}</td>
                    <td>{upload.uploadDate}</td>
                    <td>
                      <Link href={`/editUpload/${upload.id}`}>
                      <button>Details</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No uploads found</p>
          )}
        </main>
      </section>
    </main>
  );
}

export default ManageUploads;
