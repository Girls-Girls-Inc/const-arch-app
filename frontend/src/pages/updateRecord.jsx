"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import { Toaster, toast } from "react-hot-toast";
import NavigationComponent from "../components/NavigationComponent";
import InputField from "../components/InputField";

const UpdateRecordPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleSave = (e) => {
        e.preventDefault();
        toast.success("Document info saved (placeholder)");
    };

    return (
        <main>
            <Toaster position="top-center" reverseOrder={false} />
            <NavigationComponent />

            <section className="dashboard-container">
                <section className="dashboard-container-lefty d-none d-md-flex">
                    <section className="nav-top">
                        <IconButton
                            icon="account_circle"
                            label="My Profile"
                            route="/dashboard"
                        />
                        <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
                        <IconButton icon="folder" label="Directory" route="/directory" />
                        <IconButton
                            icon="group"
                            label="Manage Users"
                            route="/manageUsers"
                        />
                    </section>
                    <section className="nav-bottom">
                        <IconButton
                            onClick={() => handleLogout(setUser)}
                            icon="logout"
                            label="Log Out"
                        />
                        <IconButton icon="settings" label="Settings" route="/settings" />
                    </section>
                </section>

                <section className="dashboard-container-righty">
                    <main className="dashboard-details">
                        <h2 className="dashboard-title">Upload Document</h2>

                        <form className="dashboard-details-grid" onSubmit={handleSave}>
                            <InputField
                                type="text"
                                placeholder="File Name"
                                icon="mail"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="File Path"
                                icon="folder"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="File Type (e.g., pdf)"
                                icon="description"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="Upload ID"
                                icon="fingerprint"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="Metadata ID"
                                icon="info"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="Tags (comma separated)"
                                icon="label"
                                required={false}
                            />
                            <InputField
                                type="text"
                                placeholder="Visibility (e.g., public/private)"
                                icon="visibility"
                                required={false}
                            />

                            <div className="d-flex justify-content-center w-100 mt-4">
                                <IconButton icon="check" label="Save Changes" type="submit" />
                            </div>
                        </form>
                    </main>
                </section>
            </section>
        </main>
    );
};

export default UpdateRecordPage;
