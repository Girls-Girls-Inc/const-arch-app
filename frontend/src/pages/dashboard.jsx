"use client";
import { useUser } from "../context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  if (!user) return <p className="loading-message">Loading...</p>;

  return (
    <section className="dashboard-container">
      <section className="dashboard-container-lefty">
        <section>
          <IconButton
            icon={"account_circle"}
            label="My Profile"
            route="/profile"
          />
          <IconButton icon={"bookmark"} label="Bookmarks" route="/bookmarks" />
          <IconButton icon={"folder"} label="Directory" route="/directory" />
        </section>

        <section className="nav-padding-top">
          <IconButton icon={"settings"} label="Settings" route="/settings" />
        </section>
      </section>

      <section className="dashboard-container-righty">
        <main className="dashboard-details">
          <InputImage />
          <section className="dashboard-details-grid">
            <article>
              <h3 className="detail-label">First name</h3>
              <p className="detail-text">{user.displayName}</p>
            </article>
            <article>
              <h3 className="detail-label">Phone number</h3>
              <p className="detail-text">{user.phone || "Not provided"}</p>
            </article>
            <article>
              <h3 className="detail-label">Email address</h3>
              <p className="detail-text">{user.email}</p>
            </article>
            <article>
              <h3 className="detail-label">Physical address</h3>
              <p className="detail-muted">No address</p>
            </article>
          </section>
          <footer></footer>
        </main>
      </section>
    </section>
  );
};

export default Dashboard;
