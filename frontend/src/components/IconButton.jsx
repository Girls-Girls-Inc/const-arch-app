import React from "react";
import { Link } from "react-router-dom";
import "./Styles/button.css";

const IconButton = ({ route, icon, label }) => {
  return (
    <Link to={route} className="icon-button">
      <i className="material-symbols-outlined">{icon}</i>
      <span>{label}</span>
    </Link>
  );
};

export default IconButton;
