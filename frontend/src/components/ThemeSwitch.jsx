import React, { useState, useEffect } from "react";
import "./Styles/switch.css";

const ThemeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const switchTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  return (
    <label className="switch">
      <input type="checkbox" checked={isDarkMode} onChange={switchTheme} />
      <span className="slider round">
        <i className="material-symbols-outlined">nights_stay</i>
        <i className="material-symbols-outlined">wb_sunny</i>
      </span>
    </label>
  );
};

export default ThemeSwitch;
