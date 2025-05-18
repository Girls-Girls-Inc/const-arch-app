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
  const [files, setFiles] = useState([]);

  const fetchData = useCallback(
    async (showSuccessToast = false) => {
      const userId = auth.currentUser?.email;
      if (!userId) {
        console.log("No user logged in");
        return;
      }

      let loadingToastId;
      const toastTimer = setTimeout(() => {
        loadingToastId = toast.loading("Loading directory...");
      }, 1000);

      try {
        const dirRef = collection(db, "directory");
        const fileRef = collection(db, "upload");

        const folderQuery = currentFolderId
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

        let fileQuery;
        if (currentFolderId) {
          fileQuery = query(
            fileRef,
            where("uploadedBy", "==", userId),
            where("directoryId", "==", currentFolderId)
          );
        } else {
          // Show all files regardless of directory when on the root
          fileQuery = query(fileRef, where("uploadedBy", "==", userId));
        }

        const [folderSnap, fileSnap] = await Promise.all([
          getDocs(folderQuery),
          getDocs(fileQuery),
        ]);

        clearTimeout(toastTimer);
        if (loadingToastId) toast.dismiss(loadingToastId);

        const fetchedFolders = folderSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "folder",
        }));
        setFolders(fetchedFolders);

        const fetchedFiles = fileSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "file",
        }));
        setFiles(fetchedFiles);

        if (showSuccessToast) {
          toast.success("Directory refreshed!");
        }
      } catch (error) {
        clearTimeout(toastTimer);
        if (loadingToastId) toast.dismiss(loadingToastId);

        console.error("Error loading directory:", error);
        toast.error("Failed to load directory.");
      }
    },
    [currentFolderId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    const updated = [...breadcrumb];
    updated.pop();
    const last = updated[updated.length - 1];
    setBreadcrumb(updated);
    setCurrentFolderId(last ? last.id : null);
  };

  const handleRefresh = () => {
    fetchData(true);
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
        <IconButton icon="refresh" onClick={handleRefresh} />
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

        {files.map((file) => (
          <a
            key={file.id}
            href={file.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="file-item"
          >
            <span className="material-symbols-outlined">insert_drive_file</span>
            <span>{file.fileName || "Untitled File"}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default DirectoryBlock;
