"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";

const SettingsPage = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [toast, setToast] = useState(null);

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (newPassword && !password) {
      showToast(
        "Please enter your current password to set a new one.",
        "error"
      );
      return;
    }

    try {
      const token = await user.getIdToken();
      const updates = { uid: user.uid };

      if (username && username !== user.displayName) updates.displayName = username;
      if (email && email !== user.email) updates.email = email;
      if (password && newPassword) {
        updates.password = password;
        updates.newPassword = newPassword;
      }

      if (Object.keys(updates).length === 1) {
        showToast("No changes to save.", "info");
        return;
      }

      const res = await fetch("http://localhost:4000/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Update failed:", error);
      showToast(`Failed: ${error.message}`, "error");
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  return (
    <main>
      <button className="hamburger-btn" onClick={() => setMenuOpen((prev) => !prev)}>
        ☰
      </button>

      <section className={`dashboard-container`}>
        <section className={`dashboard-container-lefty ${menuOpen ? "open" : ""}`}>
          <section className="nav-top">
            <IconButton icon={"account_circle"} label="My Profile" route="/dashboard" />
            <IconButton icon={"bookmark"} label="Bookmarks" route="/bookmarks" />
            <IconButton icon={"folder"} label="Directory" route="/directory" />
          </section>

          <section className="nav-bottom">
            <IconButton onClick={() => handleLogout(setUser)} label="Log Out" />
            <IconButton icon={"settings"} label="Settings" route="/settings" />
          </section>
        </section>

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <InputImage />
            <form className="dashboard-details-grid" onSubmit={handleSave}>
              <label>
                Username
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </label>
              <label>
                Current Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Current password"
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                />
              </label>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              {toast && <p className={`toast ${toast.type}`}>{toast.message}</p>}
            </form>
          </main>
        </section>
      </section>
    </main>
  );
};

export default SettingsPage;
