import React from "react";
import { Link } from "react-router-dom";
import "./Styles/button.css";

const IconButton = ({ route, icon, label, onClick }) => {
  const buttonContent = (
    <>
      {icon && <i className="material-symbols-outlined">{icon}</i>}
      <span>{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button className="icon-button" onClick={onClick}>
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
