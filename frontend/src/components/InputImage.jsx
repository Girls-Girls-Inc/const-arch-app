import React from "react";
import { useUser } from "../context/userContext";
import "../index.css";

export default function InputImage() {
  const { user } = useUser();

  return (
    <section className="profile-picture-wrapper">
      {/* Label wraps image and triggers file input */}
      <label htmlFor="profile-upload" className="cursor-pointer">
        <img
          src={user.photoURL || "https://via.placeholder.com/180?text=👤"}
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
      <h1 className="text-3xl font-bold mb-1">
        Welcome, {user.displayName || "User"}
      </h1>
      <p className="text-gray-500">Member since April '25</p>
    </section>
  );
}
