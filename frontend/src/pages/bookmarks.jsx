"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";
import BookMarksContent from "../components/BookMarksContent";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";

const Bookmarks = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, loading, navigate]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  return (
    <main>
      <NavigationComponent />

      <section className="dashboard-container">
        {/* Sidebar only visible on md and up */}
        <NavigationDashLeft />

        <section className="dashboard-container-righty">
          <BookMarksContent />
        </section>
      </section>
    </main>
  );
};

export default Bookmarks;
