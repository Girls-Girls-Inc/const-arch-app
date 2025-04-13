import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../index.css";
import ThemeSwitch from "../components/ThemeSwitch";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);
  return (
    <main>
      <ThemeSwitch />
      <div className="home-container">
        <h2>Constitutional Archive App</h2>
        <div className="welcome-image-container">
          <img
            src="../src/assets/logo.png"
            alt="Welcome"
            className="welcome-image"
          />
        </div>
        <div>
          <p>
            We are currently in development.<br></br>
            Links to current Pages:
          </p>
          <br></br>
          <Link className="btn" to="/signIn">
            Sign In
          </Link>
          <Link className="btn" to="/signUp">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
