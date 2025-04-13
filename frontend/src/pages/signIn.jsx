import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../index.css";

export default function SigninPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("signin-page");

    return () => {
      document.body.classList.remove("signin-page");
    };
  }, []);

  function switchTheme() {
    var element = document.body;
    element.classList.toggle("dark-mode");
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        ).then((res) => res.json());
        setUser(userInfo);
        navigate("/welcome");
      }
    },
    onError: () => console.log("Login Failed"),
    flow: "implicit",
  });

  return (
    <main>
      {/* <label className="switch">
        <input type="checkbox" checked onchange="switchTheme()" />
        <span className="slider round">
          <i className="material-symbols-outlined">wb_sunny</i>

          <i className="material-symbols-outlined">nights_stay</i>
        </span>
      </label> */}
      <div className="login-container">
        <h2 className="form-title">Log in with</h2>
        <div className="social-login">
          <button onClick={() => login()} className="social-button">
            <img
              src="/icons/google.svg"
              alt="Google Icon"
              className="social-icon"
            />
            Google
          </button>
          <button className="social-button">
            <img
              src="/icons/facebook.svg"
              alt="Facebook Icon"
              className="social-icon"
            />
            Facebook
          </button>
        </div>
        <p className="seperator">
          <span>or</span>
        </p>
        <form action="#" className="login-form">
          <div className="input-wrapper">
            <input
              id="signin-email"
              type="email"
              placeholder="Email Address"
              className="input-field"
              required
            />
            <i className="material-symbols-outlined">mail</i>
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              required
            />
            <i className="material-symbols-outlined">lock</i>
          </div>
          <a href="#" className="forgot-password-link">
            Forgot Password?
          </a>
          <button className="login-button"></button>
          <p className="signup-text">
            Don&apos;t have an account? <Link to="/signup">Signup Instead</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
