import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import ThemeSwitch from "../components/ThemeSwitch";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import { Link } from "react-router-dom";

export default function SignUp() {
  const { setUser } = useUser();
  const [name, setName] = useState(""); // NEW name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      setUser({ ...user, displayName: name }); // also update context with the name
      navigate("/dashboard");
    } catch (error) {
      console.error("Email signup error:", error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google User:", result.user);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-up error:", error.message);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook User:", result.user);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Facebook Sign-up error:", error.message);
    }
  };

  useEffect(() => {
    document.body.classList.add("signup-page");

    return () => {
      document.body.classList.remove("signup-page");
    };
  }, []);

  if (loading) {
    return (
      <main className="loader-container">
        <div className="loader"></div>
      </main>
    );
  }

  return (
    <main>
      <ThemeSwitch />

      <div className="log-signup-container">
        <button className="btn">
          <Link to="/">
            <i className="material-symbols-outlined">arrow_back</i>
          </Link>
        </button>
        <h2 className="form-title">Sign Up with</h2>
        <div className="social-login">
          <button onClick={handleGoogleSignUp} className="social-button">
            <img
              src="/icons/google.svg"
              alt="Google Icon"
              className="social-icon"
            />
            Google
          </button>
          <button onClick={handleFacebookSignUp} className="social-button">
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

        <form onSubmit={handleSignup}>
          {/* NEW Name input field */}
          <InputField
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon="person"
            required
          />

          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="mail"
            required
          />

          <PasswordInputField
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-button" type="submit">
            Sign Up
          </button>

          <p className="signup-text">
            Already have an account? <Link to="/signin">Login Instead</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
