// IconButton.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Styles/button.css";

const IconButton = ({ route, icon, label, onClick, type = "button" }) => {
  const buttonContent = (
    <>
      {icon && <i className="material-symbols-outlined">{icon}</i>}
      <span>{label}</span>
    </>
  );

  // Render as <button> if onClick exists or if the type is "submit"
  if (onClick || type === "submit") {
    return (
      <button className="icon-button" onClick={onClick} type={type}>
        {buttonContent}
      </button>
    );
  }

  return (
    <Link to={route} className="icon-button">
      {buttonContent}
    </Link>
  );
};

export default IconButton;
