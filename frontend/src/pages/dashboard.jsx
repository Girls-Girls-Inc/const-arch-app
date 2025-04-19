"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="dashboard-container">
      <section className="dashcoard-container-lefty">
        {/* Top nav items */}
        {/* <NavLink to="/profile" className="dashboard-nav-item">
          <p>My Profile</p>
        </NavLink>
        <NavLink to="/bookmarks" className="dashboard-nav-item">
          <p>Bookmarks</p>
        </NavLink> */}
        <IconButton icon={"user"} label="My Profile" route="/profile" />
        <IconButton icon={"bookmark"} label="Bookmarks" route="/bookmarks" />
        <IconButton icon={"folder"} label="Directory" route="/directory" />

        {/* Bottom nav item */}
        <section className="nav-padding-top">
          <IconButton icon={"settings"} label="Settings" route="/settings" />
        </section>
      </section>
      <section className="dashboard-container-righty">
        <main className="dashboard_details">
          <InputImage></InputImage>
          <section className="dashboard-details-grid">
            <article>
              <h3 className="text-gray-600 font-medium">First name</h3>
              <p className="text-lg">{user.displayName}</p>
            </article>
            <article>
              <h3 className="text-gray-600 font-medium">Phone number</h3>
              <p className="text-lg">{user.phone || "Not provided"}</p>
            </article>
            <article>
              <h3 className="text-gray-600 font-medium">Email address</h3>
              <p className="text-lg">{user.email}</p>
            </article>
            <article>
              <h3 className="text-gray-600 font-medium">Physical address</h3>
              <p className="text-lg text-gray-400 italic">No address</p>
            </article>
          </section>
          <footer></footer>
        </main>
      </section>
    </section>
  );
};

export default Dashboard;
