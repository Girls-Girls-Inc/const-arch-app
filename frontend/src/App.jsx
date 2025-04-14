import React from "react";
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter from here
import Home from "./pages/home";
import SigninPage from "./pages/signIn";
import SignupPage from "./pages/signUp";
import WelcomePage from "./pages/welcome";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/error" element={<WelcomePage />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default App;
