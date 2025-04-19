import { useState, useEffect } from "react";
import { googleProvider, facebookProvider } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import ThemeSwitch from "../components/ThemeSwitch";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import { Link } from "react-router-dom";
import { signUpWithEmail, withProvider } from "../Firebase/authorisation";

function validatePassword(password) 
{
  const errors = [];

  if (password.length < 8 || password.length > 16) 
  {
    errors.push("be 8-16 characters");
  }

  if (!/[A-Z]/.test(password)) 
  {
    errors.push("include an uppercase letter");
  }

  if (!/[a-z]/.test(password)) 
  {
    errors.push("include a lowercase letter");
  }

  if (!/\d/.test(password)) 
  {
    errors.push("include a digit");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) 
  {
    errors.push("include a special character");
  }

  if (/\s/.test(password)) 
  {
    errors.push("not contain spaces");
  }

  return errors;
}

export default function SignUp() {
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
  
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrorMsg(`Password must ${passwordErrors.join(", ")}.`);
      return;
    }
  
    setLoading(true);
    try {
      const user = await signUpWithEmail(email, password, name);
      setUser({ ...user, displayName: name });
      navigate("/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMsg("Please enter a valid email address!");
          break;
        case "auth/email-already-in-use":
          setErrorMsg("This email is already in use!");
          break;
        case "auth/weak-password":
          setErrorMsg("Password should be at least 8 characters!");
          break;
        default:
          setErrorMsg("Signup failed. " + error.message);
      }
      console.error("Email signup error:", error.message);
    }

    setLoading(false);
  };   

  const handleGoogleSignUp = async () => {
    try {
      const user = await withProvider(googleProvider);
      console.log("Google User:", user);
      setUser(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-up error:", error.message);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const user = await withProvider(facebookProvider);
      console.log("Facebook User:", user);
      setUser(user);
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

          <p className="error-text">{errorMsg}</p>

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
