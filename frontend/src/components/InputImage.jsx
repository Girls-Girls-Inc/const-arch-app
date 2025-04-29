import React from "react";
import { useUser } from "../context/userContext";
import "../index.css";

export default function InputImage() {
  const { user } = useUser();

  // Set default image path
  const defaultImage = "/assets/logo.png";

  return (
    <section className="profile-picture-wrapper">
      {/* Label wraps image and triggers file input */}
      <label htmlFor="profile-upload" className="cursor-pointer">
        <img
          src={user.photoURL ? user.photoURL : defaultImage}
          alt="Profile"
          className="profile-img"
        />
      </label>

      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            console.log("Selected file:", file);
            // Upload logic will go here
          }
        }}
      />

      {/* Welcome text */}
      <h1 className="text-3xl font-bold mb-1 text-center">
        Welcome, {user.displayName || "User"}
      </h1>
      <p className="text-gray-500">Member since April '25</p>
    </section>
  );
}
