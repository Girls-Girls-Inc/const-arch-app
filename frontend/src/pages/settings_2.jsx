import { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import Toast from "../components/Toast";
import "../index.css";

export default function SettingsPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState(""); // Current password
    const [newPassword, setNewPassword] = useState(""); // New password
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (newPassword && !password) {
            showToast("Please enter your current password to set a new one.", "error");
            return;
        }

        try {
            const token = await user.getIdToken();
            const updates = { uid: user.uid };

            if (username && username !== user.displayName) {
                updates.displayName = username;
            }

            if (email && email !== user.email) {
                updates.email = email;
            }

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

    useEffect(() => {
        document.body.classList.add("settings-page");
        return () => {
            document.body.classList.remove("settings-page");
        };
    }, []);

    return (
        <>
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

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
