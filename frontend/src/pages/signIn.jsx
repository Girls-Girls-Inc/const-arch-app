import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import ThemeSwitch from "../components/ThemeSwitch";
import { withProvider, signInWithEmail } from "../Firebase/authorisation";
import { facebookProvider, googleProvider } from "../Firebase/firebase";

export default function SigninPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const LoginButton = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmail(email, password);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      switch(error.code){
        case "auth/invalid-credential":
          setErrorMsg("Email or Password is incorrect!");
          break;
        default:
          setErrorMsg("Signup failed. " + error.message);
      }
      console.error("Login failed:", error.message);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      const user = await withProvider(googleProvider);
      setUser(user);
      console.log("Google User:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-in error:", error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const user = await withProvider(facebookProvider);
      setUser(user);
      console.log("Facebook User:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Facebook Sign-in error:", error.message);
    }
  };

  useEffect(() => {
    document.body.classList.add("signin-page");
    return () => {
      document.body.classList.remove("signin-page");
    };
  }, []);

  return (
    <main>
      <ThemeSwitch />
      <div className="log-signup-container">
        <button className="btn">
          <Link to="/">
            <i className="material-symbols-outlined">arrow_back</i>
          </Link>
        </button>

        <h2 className="form-title">Login with</h2>
        <div className="social-login">
          <button onClick={handleGoogleSignIn} className="social-button">
            <img
              src="/icons/google.svg"
              alt="Google Icon"
              className="social-icon"
            />
            Google
          </button>
          <button onClick={handleFacebookSignIn} className="social-button">
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
        <form onSubmit={LoginButton} className="login-form">
          <InputField
            id="sign-up-email"
            type="email"
            placeholder="Email Address"
            icon="mail"
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInputField
            id="sign-up-email"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="error-text">{errorMsg}</p>

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
