import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../index.css";
import ThemeSwitch from "../components/ThemeSwitch";
import NavigationComponent from "../components/NavigationComponent";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);
  return (
    <main>
      <div className="home-container">
        <h2 className="form-title">Constitutional Archive App</h2>

        <div className="welcome-image-container">
          <img src="/assets/logo.png" alt="Logo" className="welcome-image" />
        </div>
        <div>
          <p>
            We are currently in development.<br></br>
            Links to current Pages:
          </p>
          <br></br>
          <Link className="btn_ca" to="/signIn">
            Sign In
          </Link>
          <Link className="btn_ca" to="/signUp">
            Sign Up
          </Link>
          <Link className="btn_ca" to="/directory">
            Directory
          </Link>
        </div>
      </div>
    </main>
  );
}
