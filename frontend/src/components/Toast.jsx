// ../components/Toast.js
import React from "react";
import "../index.css";

const Toast = ({ message, type, onClose }) => {
    return (
        <div className={`toast ${type}`}>
            <span>{message}</span>
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
    );
};

export default Toast;
