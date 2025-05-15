import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import "../index.css";

// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getAuth, updateProfile } from "firebase/auth";
// import { db } from "../Firebase/firebase";
// import { doc, updateDoc } from "firebase/firestore";

export default function InputImage({ canUpload = true, onImageUpload }) {
  const { user /*, setUser */ } = useUser();

  const defaultImage = "/assets/logo.png";

  const [ previewURL, setPreviewURL ] = useState(user?.photoURL || defaultImage);

  const formattedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime)
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .replace(/\d{4}$/, (year) => `'${year.slice(-2)}`)
    : "N/A";


  useEffect(() => {
    // Reset preview if user data changes (e.g., after Save)
    setPreviewURL(user?.photoURL || defaultImage);
  }, [user]);

  const handleFileChange = (e) => {
    if (!canUpload) return;

    const file = e.target.files[0];
    
    if (!file) return;

    const tempURL = URL.createObjectURL(file);
    setPreviewURL(tempURL);

    // Let parent know a file was selected
    onImageUpload && onImageUpload(file);
  };

  /*
const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const auth = getAuth();

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: downloadURL });

        // Update Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { photoURL: downloadURL });

        // Force reload and update user context
        await auth.currentUser.reload();
        setUser(auth.currentUser); // Triggers UI re-render immediately
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };
*/

  return (
    <section className="profile-picture-wrapper">
      {/* Conditionally render upload input */}
      <label
        htmlFor={canUpload ? "profile-upload" : undefined}
        className={canUpload ? "cursor-pointer" : ""}
      >
        <img
          src={previewURL}
          alt="Profile"
          className="profile-img"
        />

      </label>

      {canUpload && (
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          //className="hidden"
          style={{display: "none"}}
          onChange={handleFileChange}
        />
      )}

      <h1 className="text-3xl font-bold mb-1 text-center">
        Welcome, {user?.displayName || "User"}
      </h1>

      <p className="text-gray-500">
        Member since{" "}
        {formattedDate}
      </p>
    </section>
  );
}
