import React from "react";
import { Link } from "react-router-dom";
import "./Styles/button.css";

const IconButton = ({ route, icon, label, onClick }) => {
  if (onClick) {
    return (
      <button className="icon-button" onClick={onClick}>
        {icon && <i className="material-symbols-outlined">{icon}</i>}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link to={route} className="icon-button">
      {icon && <i className="material-symbols-outlined">{icon}</i>}
      <span>{label}</span>
    </Link>
  );
};

export default IconButton;
