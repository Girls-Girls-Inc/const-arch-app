import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../index.css";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import ThemeSwitch from "../components/ThemeSwitch";

export default function SigninPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("signin-page"); // Add class to the body when this page loads

    return () => {
      document.body.classList.remove("signin-page"); // Clean up by removing the class when the component is unmounted
    };
  }, []);

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
      <ThemeSwitch />
      <div className="login-container">
        <button className="btn">
          <Link to="/">
            <i className="material-symbols-outlined">arrow_back</i>
          </Link>
        </button>

        <h2 className="form-title">Login with</h2>
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
          <InputField
            id="sign-up-email"
            type="email"
            placeholder="Emails"
            icon="mail"
          />
          {/* <InputField
            id="sign-up-password"
            type="password"
            placeholder="Password"
            icon="lock"
          /> */}
          <PasswordInputField id="sign-up-email" placeholder="Password" />
          <a href="#" className="forgot-password-link">
            Forgot Password?
          </a>
          <button className="login-button">Login</button>
          <p className="signup-text">
            Don&apos;t have an account? <Link to="/signup">Signup Instead</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
