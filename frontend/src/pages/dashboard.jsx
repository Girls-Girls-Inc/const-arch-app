"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";
import NavigationComponent from "../components/NavigationComponent";
import { Toaster, toast } from "react-hot-toast";
import NavigationDashLeft from "../components/NavigationDashLeft";

const Dashboard = () => {
  const { user, loading } = useUser();
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
          <main className="dashboard-details">
            <InputImage />
            <section className="dashboard-details-profile">
              <article>
                <h3 className="detail-label">
                  <i className="material-symbols-outlined">badge</i> First name
                </h3>
                <p className="detail-text">{user.displayName}</p>
              </article>
              <article>
                <h3 className="detail-label">
                  <i className="material-symbols-outlined">call</i> Phone number
                </h3>
                <p className="detail-text">{user.phone || "Not provided"}</p>
              </article>
              <article>
                <h3 className="detail-label">
                  <i className="material-symbols-outlined">mail</i> Email
                  address
                </h3>
                <p className="detail-text">{user.email}</p>
              </article>
              <article>
                <h3 className="detail-label">
                  <i className="material-symbols-outlined">home</i> Physical
                  address
                </h3>
                <p className="detail-muted">No address</p>
              </article>
            </section>
          </main>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
