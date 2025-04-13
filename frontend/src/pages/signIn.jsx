import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";
import { signInUser } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";

export default function SigninPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoginButton = async (e) => {
    e.preventDefault();
    try {
      const user = await signInUser(email, password);
      setUser(user);
      navigate("/welcome");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google User:", result.user);
      setUser(result.user);
      navigate("/welcome");
    } catch (error) {
      console.error("Google Sign-in error:", error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook User:", result.user);
      setUser(result.user);
      navigate("/welcome");
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
      <div className="login-container">
        <h2 className="form-title">Log in with</h2>
        <div className="social-login">
          <button onClick={handleGoogleSignIn} className="social-button">
            <img src="/icons/google.svg" alt="Google Icon" className="social-icon" />
            Google
          </button>
          <button onClick={handleFacebookSignIn} className="social-button">
            <img src="/icons/facebook.svg" alt="Facebook Icon" className="social-icon" />
            Facebook
          </button>
        </div>
        <p className="seperator"><span>or</span></p>
        <form onSubmit={LoginButton} className="login-form">
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="material-symbols-outlined">mail</i>
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="material-symbols-outlined">lock</i>
          </div>
          <a href="#" className="forgot-password-link">Forgot Password?</a>
          <button className="login-button">Log In</button>
          <p className="signup-text">
            Don&apos;t have an account? <Link to="/signup">Signup Instead</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
