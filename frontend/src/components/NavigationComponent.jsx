import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";

const NavigationComponent = ({ PageName, links = [] }) => {
  const navRef = useRef(null);

  useEffect(() => {
    const navbarHeight = navRef.current?.offsetHeight || 0;
    document.body.style.paddingTop = `calc(${navbarHeight}px + 1rem)`;
    return () => {
      document.body.style.paddingTop = "";
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm"
    >
      <div className="container-fluid px-4">
        <span className="navbar-brand fs-4 fw-bold">{PageName}</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {links.map((link, index) => (
              <li className="nav-item" key={index}>
                <Link to={link.to} className="nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-lg-flex flex-column align-items-start gap-2 mt-3 mt-lg-0">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationComponent;
