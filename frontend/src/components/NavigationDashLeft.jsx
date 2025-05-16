import React from "react";
import { useUser } from "../context/userContext";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import { useNavigate } from "react-router-dom";

const NavigationDashLeft = () => {
  const { user, setUser, isAdmin } = useUser();

  const navigate = useNavigate();
  return (
    <section className="dashboard-container-lefty d-none d-md-flex">
      <section className="nav-top">
        <section className="logo-container">
          <img src="/assets/logo.png" alt="Logo" className="logo-navbar" />
          <h2>Constitutional Archive</h2>
        </section>

        <IconButton
          icon={"account_circle"}
          label="My Profile"
          route="/dashboard"
        />
        <IconButton icon={"search"} label="Search" route="/search" />
        <IconButton icon={"bookmark"} label="Bookmarks" route="/bookmarks" />

        {isAdmin && (
          <>
            <IconButton icon={"folder"} label="Directory" route="/directory" />
            <IconButton
              icon={"group"}
              label="Manage Users"
              route="/manageUsers"
            />
            <IconButton
              icon={"upload_file"}
              label="Manage uploads"
              route="/manageUploads"
            />
          </>
        )}
      </section>

      <section className="nav-bottom">
        <IconButton
          onClick={() => handleLogout(setUser, navigate)}
          icon={"logout"}
          label="Log Out"
        />
        <IconButton icon={"settings"} label="Settings" route="/settings" />
      </section>
    </section>
  );
};

export default NavigationDashLeft;
