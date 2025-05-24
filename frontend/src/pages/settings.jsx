"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";
import { Toaster, toast } from "react-hot-toast";
import NavigationComponent from "../components/NavigationComponent";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import NavigationDashLeft from "../components/NavigationDashLeft";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  getAuth, updateProfile, EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const SettingsPage = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

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

      let newPhotoURL;
      if (selectedImageFile) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, `profileImages/${user.uid}`);
          await uploadBytes(storageRef, selectedImageFile);
          newPhotoURL = await getDownloadURL(storageRef);
          updates.photoURL = newPhotoURL;

          const auth = getAuth();
          await updateProfile(auth.currentUser, { photoURL: newPhotoURL });
        } catch (err) {
          toast.error("Image upload failed");
          console.error(err);
          return;
        }
      }

      if (username && username !== user.displayName) {
        updates.displayName = username;
      }

      if (email && email !== user.email) updates.email = email;
      if (password && newPassword) {
        const credential = EmailAuthProvider.credential(user.email, password);
        const auth = getAuth();
        await reauthenticateWithCredential(auth.currentUser, credential);

        await updatePassword(auth.currentUser, newPassword);
      }

      const hasProfileChange =
        (username && username !== user.displayName) ||
        (email && email !== user.email) ||
        selectedImageFile ||
        (password && newPassword);

      if (!hasProfileChange) {
        toast("No changes to save.", { icon: "ℹ️" });
        return;
      }

      console.log("Sending update request with payload:", updates);

      const HOST_URL = import.meta.env.VITE_API_HOST_URL;
      const res = await fetch(`${HOST_URL}/api/user/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid server response: " + text);
      }
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");

      toast.success("Profile updated successfully!");

      const auth = getAuth();

      if (username && username !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: username });
      }

      setUser({
        ...auth.currentUser,
        displayName: username,
      });

      await auth.currentUser.reload();
      setUser(auth.currentUser);
    } catch (error) {
      toast.error(`Failed: ${error.message}`);
    }
  };

  if (loading) return <p className="loading-message">Loading...</p>;

  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <NavigationComponent />

      <section className="dashboard-container">
        <NavigationDashLeft />

        <section className="dashboard-container-righty">
          <article className="dashboard-details">
            <header>
              <h2 className="right-title">Settings</h2>
            </header>

            <section aria-label="Profile Picture Upload">
              <InputImage
                canUpload={true}
                onImageUpload={(file) => setSelectedImageFile(file)}
              />
            </section>

            <form
              className="dashboard-details-grid-form"
              onSubmit={handleSave}
              aria-label="User Settings Form"
            >
              <fieldset className="dashboard-details-grid">
                <legend className="visually-hidden">Profile Details</legend>

                <InputField
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  icon="badge"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={false}
                />
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  icon="mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={false}
                />
                <PasswordInputField
                  id="CurrentPassword"
                  name="CurrentPassword"
                  type="password"
                  placeholder="Current password"
                  icon="lock"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={false}
                />
                <PasswordInputField
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="New password"
                  icon="lock_reset"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required={false}
                />
              </fieldset>

              <footer className="d-flex justify-content-center w-100 mt-4">
                <IconButton icon="check" label="Save Changes" type="submit" />
              </footer>
            </form>
          </article>
        </section>
      </section>
    </main>
  );

};

export default SettingsPage;