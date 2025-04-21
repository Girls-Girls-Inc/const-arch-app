// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SigninPage from "./pages/signIn";
import SignupPage from "./pages/signUp";
import UploadPage from "./pages/uploadPage";
import Directory from "./pages/directory";
import Dashboard from "./pages/dashboard";
import SettingsPage from "./pages/settings";
import ErrorPage from "./pages/error"
import Bookmarks from "./pages/bookmarks"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/directory" element={<Directory />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default App;
