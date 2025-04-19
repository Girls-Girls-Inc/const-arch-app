// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SigninPage from "./pages/signIn";
import SignupPage from "./pages/signUp";
import WelcomePage from "./pages/welcome";
import UploadPage from "./pages/uploadPage";
import Directory from "./pages/directory";
import Dashboard from "./pages/dashboard";
import SettingsPage from "./pages/settings";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<WelcomePage />} />
      <Route path="/error" element={<WelcomePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/directory" element={<Directory />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<SettingsPage />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default App;
