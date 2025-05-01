"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";
import { Toaster, toast } from "react-hot-toast";
import NavigationComponent from "../components/NavigationComponent";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import NavigationDashLeft from "../components/NavigationDashLeft";

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
        toast("No changes to save.", { icon: "ℹ️" });
        return;
      }

      console.log("Sending update request with payload:", updates);

      const HOST_URL = import.meta.env.VITE_API_HOST_URL;

      const res = await fetch(`${HOST_URL}/api/settings/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Profile updated successfully!");

      setUser((prevUser) => ({
        ...prevUser,
        displayName: username || prevUser.displayName,
        email: email || prevUser.email,
      }));
      //setUsername(username || prevUser.displayName);

    } catch (error) {
      toast.error(`Failed: ${error.message}`);
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <NavigationComponent />

      <section className="dashboard-container">
        <NavigationDashLeft />

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <h2 className="dashboard-title">Settings</h2>
            <InputImage />

            <form className="dashboard-details-grid-form" onSubmit={handleSave}>
              <div className="dashboard-details-grid">
                <InputField
                  type="text"
                  placeholder="Enter username"
                  icon="badge"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={false}
                />
                <InputField
                  type="email"
                  placeholder="Enter email"
                  icon="mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={false}
                />
                <PasswordInputField
                  type="password"
                  placeholder="Current password"
                  icon="lock"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={false}
                />
                <PasswordInputField
                  type="password"
                  placeholder="New password"
                  icon="lock_reset"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required={false}
                />
              </div>
              <div className="d-flex justify-content-center w-100">
                <IconButton icon="check" label="Save Changes" type="submit" />
              </div>


            </form>
          </main>
        </section>
      </section>
    </main>
  );
};

export default SettingsPage;
