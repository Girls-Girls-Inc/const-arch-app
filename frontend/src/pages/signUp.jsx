import { useState, useEffect } from "react";
import { googleProvider, facebookProvider } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import ThemeSwitch from "../components/ThemeSwitch";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import { Link } from "react-router-dom";
import { signUpWithEmail, withProvider } from "../Firebase/authorisation";
import toast, { Toaster } from "react-hot-toast";

export default function SignUp() {
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showIgnoreToasts, setShowIgnoreToasts] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      // Do not proceed if password invalid
      return;
    }

    setLoading(true);
    try {
      const user = await signUpWithEmail(email, password, name);
      toast.dismiss(); // Dismiss any leftover toasts once signup succeeds
      setUser({ ...user, displayName: name });
      navigate("/dashboard");
    } catch (error) {
      let message = "Signup failed. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          message = "Please enter a valid email address!";
          break;
        case "auth/email-already-in-use":
          message = "This email is already in use!";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters!";
          break;
        default:
          message = "Signup failed. " + error.message;
      }
      toast.error(message);
      console.error("Email signup error:", error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    try {
      const user = await withProvider(googleProvider);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google Sign-up failed. Please try again.");
      console.error("Google Sign-up error:", error.message);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const user = await withProvider(facebookProvider);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Facebook Sign-up failed. Please try again.");
      console.error("Facebook Sign-up error:", error.message);
    }
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 6) {
      errors.push("at least 6 characters");
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push("at least one letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("at least one number");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>_]/.test(password)) {
      errors.push("at least one special character");
    }

    setPasswordErrors(errors);

    toast.dismiss(); // Always dismiss old toasts before adding new ones

    if (errors.length > 0) {
      errors.forEach((error, index) => {
        toast.error(`Password must have ${error}`, {
          id: `password-error-${index}`,
          duration: 3000, // Toast disappears after 3 seconds
        });
      });
    }

    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword); // Validate password as the user types
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
      <div className="log-signup-container">
        <button className="btn_ca">
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
            onChange={handlePasswordChange} // Use the new handler
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

      {/* Display toasts */}

      <Toaster position="top-right" />
    </main>
  );
}
