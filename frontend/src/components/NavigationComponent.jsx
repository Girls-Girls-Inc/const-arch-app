import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Styles/navigationComp.css";
import "../index.css";
import ThemeSwitch from "./ThemeSwitch";

const NavigationComponent = ({ PageName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((o) => !o);

  return (
    <>
      {/* Overlay behind drawer */}
      <div
        className={`drawer-overlay ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      />

      <header className="custom-header">
        <div className="header-title-container">
          <h1 className="header-title">{PageName}</h1>
        </div>

        <div className="header-right">
          {/* Hamburger / Close icon */}
          <button className="hamburger" onClick={toggleMenu}>
            {isMenuOpen ? "✕" : "☰"}
          </button>

          {/* Sliding drawer */}
          <div className={`menu ${isMenuOpen ? "open" : ""}`}>
            <Link to="/signin" className="btn" onClick={toggleMenu}>
              Login
            </Link>
            <Link to="/signup" className="btn" onClick={toggleMenu}>
              Signup
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </header>
    </>
  );
};

export default NavigationComponent;
