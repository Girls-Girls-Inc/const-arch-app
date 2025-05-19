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
  disabled = false,
  className = "",
}) => {
  const buttonContent = (
    <>
      {icon && <i className="material-symbols-outlined">{icon}</i>}
      <span>{label}</span>
    </>
  );

  if (onClick || type === "submit") {
    return (
      <button
        className={`icon-button ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
        style={disabled ? { pointerEvents: "none" } : undefined}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <Link
      to={route}
      className={`icon-button ${className}`}
      target={target}
      aria-disabled={disabled ? "true" : "false"}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
    >
      {buttonContent}
    </Link>
  );
};

export default IconButton;
