// components/NavigationComponent.js
"use client";
import { useState } from "react";
import React from "react";
import IconButton from "./IconButton";
import { handleLogout } from "../Firebase/authorisation";
import { useUser } from "../context/userContext";

const NavigationComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setUser } = useUser();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="hamburger-btn_ca d-md-none"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-dropdown-nav d-md-none">
          <IconButton
            icon="account_circle"
            label="My Profile"
            route="/dashboard"
          />
          <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
          <IconButton icon="folder" label="Directory" route="/directory" />
          <IconButton icon="group" label="Manage Users" route="/manageUsers" />
          <IconButton
            onClick={() => handleLogout(setUser)}
            icon="logout"
            label="Log Out"
          />
          <IconButton icon="settings" label="Settings" route="/settings" />
        </div>
      )}
    </>
  );
};

export default NavigationComponent;
