import { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import "../index.css";

export default function SettingsPage() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState(""); // Current password
    const [newPassword, setNewPassword] = useState(""); // New password

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const token = await user.getIdToken();

            // Initialize an object to hold only the fields that have changed
            const updates = { uid: user.uid };

            // Check and include displayName if it has changed
            if (username && username !== user.displayName) {
                updates.displayName = username;
            }

            // Check and include email if it has changed
            if (email && email !== user.email) {
                updates.email = email;
            }

            // Include password fields only if both are provided
            if (password && newPassword) {
                updates.password = password;
                updates.newPassword = newPassword;
            }

            // If no fields have changed, inform the user and exit
            if (Object.keys(updates).length === 1) {
                alert("No changes to save.");
                return;
            }

            // Send the update request to the server
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

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            alert(`Failed: ${error.message}`);
        }
    };


    useEffect(() => {
        document.body.classList.add("settings-page");
        return () => {
            document.body.classList.remove("settings-page");
        };
    }, []);

    return (
        <main>
            <div className="log-signup-container">
                <h2 className="form-title">Account Settings</h2>
                <form onSubmit={handleSave} className="s-form">
                    <h3>Change your username</h3>
                    <InputField
                        id="settings-username"
                        type="text"
                        placeholder="Username"
                        icon="person"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <h3>Change your email</h3>
                    <InputField
                        id="settings-email"
                        type="email"
                        placeholder="Email Address"
                        icon="mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h3>Change your password</h3>
                    <PasswordInputField
                        id="settings-old-password"
                        placeholder="Current Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordInputField
                        id="settings-new-password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button className="login-button">Save Changes</button>
                </form>
            </div>
        </main>
    );
}
