"use client";
import React from "react";
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

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  return (
    <main>
      <NavigationComponent />
      <section className="dashboard-container">
        <NavigationDashLeft />
        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <InputImage canUpload={false} />
            <section className="dashboard-details-profile">
              <article>
                <h3 className="detail-label">
                  <i className="material-symbols-outlined">badge</i> First name
                </h3>
                <p className="detail-text">{user.displayName}</p>
              </article>

              <article>
                <h3 className="detail-label">
                  <i className="material-symbols-outlined">mail</i> Email
                  address
                </h3>
                <p className="detail-text">{user.email}</p>
              </article>
            </section>
          </main>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
