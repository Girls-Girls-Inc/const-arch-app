import React from "react";
import { Link } from "react-router-dom";
import "./Styles/button.css";

const IconButton = ({
  route,
  icon,
  label,
  onClick,
  type = "button",
  target = null, 
}) => {
  const buttonContent = (
    <>
      {icon && <i className="material-symbols-outlined">{icon}</i>}
      <span>{label}</span>
    </>
  );

  if (onClick || type === "submit") {
    return (
      <button className="icon-button" onClick={onClick} type={type}>
        {buttonContent}
      </button>
    );
  }

  return (
    <Link
      to={route}
      className="icon-button"
      target={target} 
    >
      {buttonContent}
    </Link>
  );
};

export default IconButton;
