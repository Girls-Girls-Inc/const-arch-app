import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase";
import IconButton from "../IconButton";
import toast from "react-hot-toast";

const DirectoryBlock = ({
  currentFolderId,
  setCurrentFolderId,
  breadcrumb,
  setBreadcrumb,
}) => {
  const [folders, setFolders] = useState([]);

  const fetchFolders = useCallback(async () => {
    const userId = auth.currentUser?.email;
    if (!userId) {
      console.log("No user logged in");
      return;
    }

    let loadingToastId;
    const toastTimer = setTimeout(() => {
      loadingToastId = toast.loading("Loading folders...");
    }, 1000);

    try {
      const dirRef = collection(db, "directory");

      const foldersQuery = currentFolderId
        ? query(
            dirRef,
            where("createdBy", "==", userId),
            where("parentId", "==", currentFolderId)
          )
        : query(
            dirRef,
            where("createdBy", "==", userId),
            where("parentId", "==", null)
          );

      const snapshot = await getDocs(foldersQuery);

      clearTimeout(toastTimer);
      if (loadingToastId) toast.dismiss(loadingToastId);

      if (snapshot.empty) {
        setFolders([]);
      } else {
        const fetchedFolders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFolders(fetchedFolders);
      }
    } catch (error) {
      clearTimeout(toastTimer);
      if (loadingToastId) toast.dismiss(loadingToastId);

      console.error("Error fetching folders:", error);
      toast.error("Error loading folders");
    }
  }, [currentFolderId]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleFolderClick = (folder) => {
    if (
      breadcrumb.length === 0 ||
      breadcrumb[breadcrumb.length - 1].id !== folder.id
    ) {
      setBreadcrumb((prev) => [...prev, { id: folder.id, name: folder.name }]);
    }
    setCurrentFolderId(folder.id);
  };

  const handleGoBack = () => {
    if (breadcrumb.length === 0) return;

    const updatedBreadcrumb = [...breadcrumb];
    updatedBreadcrumb.pop();
    const previous = updatedBreadcrumb[updatedBreadcrumb.length - 1];
    setCurrentFolderId(previous ? previous.id : null);
    setBreadcrumb(updatedBreadcrumb);
  };

  return (
    <div className="folder-list">
      <div className="breadcrumb-nav">
        <div className="bnav-left">
          <IconButton
            icon="arrow_back"
            label="Back"
            onClick={handleGoBack}
            disabled={breadcrumb.length === 0}
            className={breadcrumb.length === 0 ? "disabled-back-button" : ""}
          />
          {breadcrumb.length > 0 && (
            <span>/ {breadcrumb.map((b) => b.name).join(" / ")}</span>
          )}
        </div>

        <IconButton icon="refresh" label="Refresh" onClick={fetchFolders} />
      </div>

      <div className="folders-grid">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => handleFolderClick(folder)}
            className="folder-item"
          >
            <span className="material-symbols-outlined">folder</span>
            <span>{folder.name || "Untitled Folder"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectoryBlock;
