"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";
import toast, { Toaster } from "react-hot-toast";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";

const SettingsPage = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    document.body.classList.add("settings-page");
    return () => {
      document.body.classList.remove("settings-page");
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (newPassword && !password) {
      toast.error("Please enter your current password to set a new one.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const updates = { uid: user.uid };

      if (username && username !== user.displayName)
        updates.displayName = username;
      if (email && email !== user.email) updates.email = email;
      if (password && newPassword) {
        updates.password = password;
        updates.newPassword = newPassword;
      }

      if (Object.keys(updates).length === 1) {
        toast.error("No changes to save.");
        return;
      }

      console.log("Sending update request with payload:", updates);

      const res = await fetch("http://localhost:4000/api/settings/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) throw new Error(data.error);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(`Failed: ${error.message}`);
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  return (
    <main>
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      <section className="dashboard-container">
        <section className={`dashboard-container-lefty ${menuOpen ? "open" : ""}`}>
          <section className="nav-top">
            <IconButton icon="account_circle" label="My Profile" route="/dashboard" />
            <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
            <IconButton icon="folder" label="Directory" route="/directory" />

          </section>

          <section className="nav-bottom">
            <IconButton onClick={() => handleLogout(setUser)} label="Log Out" />
            <IconButton icon="settings" label="Settings" route="/settings" />
          </section>
        </section>

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <h2 className="dashboard-title">Settings</h2>
            <InputImage />
            <form onSubmit={handleSave}>
              <section className="dashboard-details-grid">
                <article>
                  <h3 className="detail-label">
                    <i className="material-symbols-outlined">badge</i> Name
                  </h3>
                  <InputField
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon="person"
                  />
                </article>

                <article>
                  <h3 className="detail-label">
                    <i className="material-symbols-outlined">mail</i> Email
                  </h3>
                  <InputField
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon="mail"
                  />
                </article>

                <article>
                  <h3 className="detail-label">
                    <i className="material-symbols-outlined">lock</i> Current Password
                  </h3>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon="lock"
                  />
                </article>

                <article>
                  <h3 className="detail-label">
                    <i className="material-symbols-outlined">lock_reset</i> New Password
                  </h3>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </article>
              </section>

              <footer>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <Toaster position="top-right" />
              </footer>
            </form>
          </main>
        </section>
      </section>
    </main>
  );
};

export default SettingsPage;