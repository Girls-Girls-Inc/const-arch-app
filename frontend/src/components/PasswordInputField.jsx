import React, { useState } from "react";

const PasswordInputField = ({
  id,
  placeholder,
  onChange,
  value,
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="input-wrapper">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="input-field"
        required={required}
        onChange={onChange}
        value={value}
      />
      <i className="material-symbols-outlined lock-icon">lock</i>
      <span
        className="material-symbols-outlined eye-icon"
        onClick={togglePassword}
      >
        {showPassword ? "visibility_off" : "visibility"}
      </span>
    </div>
  );
};

export default PasswordInputField;
