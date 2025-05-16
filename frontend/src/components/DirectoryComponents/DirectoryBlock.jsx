import React, { useState, useEffect } from "react";
import ShowItems from "./ShowItems";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../Firebase/firebase";

const DirectoryBlock = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const foldersSnapshot = await getDocs(
          collection(db, "users", userId, "folders")
        );
        const fetchedFolders = foldersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFolders(
          fetchedFolders.map(
            (folder) => folder.name || folder.title || "Untitled Folder"
          )
        );
        const filesSnapshot = await getDocs(
          collection(db, "users", userId, "files")
        );
        const fetchedFiles = filesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles(fetchedFiles.map((file) => file.fileName || "Untitled File"));
      } catch (error) {
        console.error("Error fetching folders or files:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="col-md-12 w-100">
      <ShowItems title="Created folders" items={folders} />
      <ShowItems title="Created files" items={files} />
    </div>
  );
};

export default DirectoryBlock;
