"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../index.css";

export default function WelcomePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, [user, navigate]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
  <section className = "dashboard-container">
    <section className="dashcoard-container-lefty">
    {/* Top nav items */}
      <NavLink to="/profile" className="dashboard-nav-item">
        <p>My Profile</p>
      </NavLink>
      <NavLink to="/bookmarks" className="dashboard-nav-item">
        <p>Bookmarks</p>
      </NavLink>

    {/* Bottom nav item */}
      <section className="nav-padding-top">
        <NavLink to="/settings" className="dashboard-nav-item">
          <p>Settings</p>
        </NavLink>
      </section>
    </section>
    <section className="dashboard-container-righty">
      <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user.displayName || "User"}
          </h1>
          <p className="text-gray-500">Member since April '25</p>
        </header>

        <section className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-sm w-full max-w-3xl">
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

        <footer>
        </footer>
      </section>
  </section>
  );
}
