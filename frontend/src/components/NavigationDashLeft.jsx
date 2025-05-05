import React from "react";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";

const NavigationDashLeft = () => {
  const { setUser } = useUser();
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
        <IconButton icon={"folder"} label="Directory" route="/directory" />
        <IconButton icon={"group"} label="Manage Users" route="/manageUsers" />
      </section>

      <section className="nav-bottom">
        <IconButton
          onClick={() => handleLogout(setUser)}
          icon={"logout"}
          label="Log Out"
        />
        <IconButton icon={"settings"} label="Settings" route="/settings" />
      </section>
    </section>
  );
};

export default NavigationDashLeft;
