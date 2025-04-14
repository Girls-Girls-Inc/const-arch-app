"use client";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signup"); // no user logged in
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Loading...</p>; // Show loading while checking user
  }

  return (
    <main className="welcome-page">
      <div className="welcome-image-container">
        <img src="/assets/logo.png" alt="Welcome" className="welcome-image" />
      </div>
      <h1 className="welcome-title">
        Welcome{user.displayName ? `, ${user.displayName}` : "!"}
      </h1>
      <p className="welcome-text">We're excited to have you here 🎉</p>
    </main>
  );
}
