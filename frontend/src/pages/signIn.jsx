import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { signInUser } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";
import "../index.css";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import ThemeSwitch from "../components/ThemeSwitch";

export default function SigninPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoginButton = async (e) => {
    e.preventDefault(); // Prevent actual form submission

    try {
      const user = await signInUser(email, password);
      setUser(user);
      navigate("/welcome");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  useEffect(() => {
    document.body.classList.add("signin-page"); // Add class to the body when this page loads

    return () => {
      document.body.classList.remove("signin-page"); // Clean up by removing the class when the component is unmounted
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
