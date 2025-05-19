import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import "../index.css";

export function handleFileChange(e, canUpload, onImageUpload, setPreviewURL) {
  if (!canUpload) return;

  const file = e.target.files[0];
  if (!file) return;

  const tempURL = URL.createObjectURL(file);
  setPreviewURL(tempURL);
  onImageUpload && onImageUpload(file);
}

export default function InputImage({ canUpload = true, onImageUpload }) {
  const { user } = useUser();
  const defaultImage = "/assets/logo.png";

  const [previewURL, setPreviewURL] = useState(user?.photoURL || defaultImage);

  const formattedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime)
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .replace(/\d{4}$/, (year) => `'${year.slice(-2)}`)
    : "N/A";

  useEffect(() => {
    setPreviewURL(user?.photoURL || defaultImage);
  }, [user]);

  return (
    <section
      className="profile-picture-wrapper"
      data-testid="input-image-section"
    >
      <label
        htmlFor={canUpload ? "profile-upload" : undefined}
        className={canUpload ? "cursor-pointer" : ""}
        data-testid="profile-label"
      >
        <img
          src={previewURL}
          alt="Profile"
          className="profile-img"
          data-testid="profile-img"
        />
      </label>

      {canUpload && (
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) =>
            handleFileChange(e, canUpload, onImageUpload, setPreviewURL)
          }
          data-testid="file-input"
        />
      )}

      <h1
        className="text-3xl font-bold mb-1 text-center"
        data-testid="welcome-text"
      >
        Welcome, {user?.displayName || "User"}
      </h1>

      <p className="text-gray-500" data-testid="member-since">
        Member since {formattedDate}
      </p>
    </section>
  );
}
