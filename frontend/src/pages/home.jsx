import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { Toaster } from "react-hot-toast";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("home-page");
    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <main>
      <Toaster position="top-right" />

      <section className="home-container">
        <header>
          <h2 className="form-title">Ink & Parchment Archive</h2>
        </header>

        <figure className="welcome-image-container">
          <img src="/assets/logo.png" alt="Logo" className="welcome-image" />
        </figure>

        <section aria-label="Welcome Message and Actions">
          <p>
            Welcome to Ink And Parchment
            <br />
          </p>

          <nav className="mt-3">
            <Link className="btn_ca" to="/signin">
              Sign In
            </Link>
            <Link className="btn_ca" to="/signup">
              Sign Up
            </Link>
          </nav>
        </section>
      </section>
    </main>
  );
}
