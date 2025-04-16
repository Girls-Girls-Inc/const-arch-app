import { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import ThemeSwitch from "../components/ThemeSwitch";
import "../index.css";

export default function SettingsPage() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");

    const handleSave = (e) => {
        e.preventDefault();
        // In a real app you'd update Firebase user info or another backend
        console.log("Saved settings:", { username, email, password });
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
                        id="settings-password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="login-button">Save Changes</button>
                </form>
            </div>
        </main>
    );
}
