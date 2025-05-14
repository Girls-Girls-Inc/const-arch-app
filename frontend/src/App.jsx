import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SigninPage from "./pages/signIn";
import SignupPage from "./pages/signUp";
import UploadPage from "./pages/uploadPage";
import Directory from "./pages/directory";
import Dashboard from "./pages/dashboard";
import SettingsPage from "./pages/settings";
import Bookmarks from "./pages/bookmarks";
import ManageUsers from "./pages/manageUsers";
import EmailLinkHandler from "./pages/EmailLinkHandler";
import SearchPage from "./pages/search";
import ManageUploads from "./pages/manageUploads";
import EditUpload from "./pages/editUpload";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/directory" element={<Directory />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/manageUsers" element={<ManageUsers />} />
      <Route path="/verify-link" element={<EmailLinkHandler />} />
      <Route path="/manageUploads" element={<ManageUploads />} />
      <Route path="/editUpload/:id" element={<EditUpload />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default App;
