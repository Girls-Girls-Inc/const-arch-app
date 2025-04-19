import React from "react";

const InputField = ({ id, type, placeholder, icon, onChange, value }) => {
  return (
    <div className="input-wrapper">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="input-field"
        onChange={onChange}
        value={value}
        required
      />
      <i className="material-symbols-outlined">{icon}</i>
    </div>
  );
};

export default InputField;
