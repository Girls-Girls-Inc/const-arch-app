import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import { withProvider, signInWithEmail } from "../Firebase/authorisation";
import { facebookProvider, googleProvider } from "../Firebase/firebase";
import toast, { Toaster } from "react-hot-toast";

export default function SigninPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginWithEmail = async () => {
    const user = await signInWithEmail(email, password);
    setUser(user);
    navigate("/dashboard");
  };

  const LoginButton = (e) => {
    e.preventDefault();
    setErrorMsg("");

    toast.promise(loginWithEmail(), {
      loading: "Logging in...",
      success: <b>Logged in successfully!</b>,
      error: (err) => {
        let message = "Login failed. Please try again.";
        switch (err?.code) {
          case "auth/invalid-credential":
            message = "Email or Password is incorrect!";
            break;
          default:
            message = "Login failed. " + err.message;
        }
        setErrorMsg(message);
        return <b>{message}</b>;
      },
    });
  };

  const handleGoogleSignIn = () => {
    toast.promise(
      withProvider(googleProvider).then((user) => {
        setUser(user);
        navigate("/dashboard");
      }),
      {
        loading: "Signing in with Google...",
        success: <b>Signed in successfully!</b>,
        error: <b>Google Sign-in failed. Please try again.</b>,
      }
    );
  };

  const handleFacebookSignIn = () => {
    toast.promise(
      withProvider(facebookProvider).then((user) => {
        setUser(user);
        navigate("/dashboard");
      }),
      {
        loading: "Signing in with Facebook...",
        success: <b>Signed in successfully!</b>,
        error: <b>Facebook Sign-in failed. Please try again.</b>,
      }
    );
  };

  useEffect(() => {
    document.body.classList.add("signin-page");
    return () => {
      document.body.classList.remove("signin-page");
    };
  }, []);

  return (
    <main>
      <Toaster position="top-right" />
      <div className="log-signup-container">
        <button className="btn_ca">
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
            required
          />
          <PasswordInputField
            id="sign-up-password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && (
            <div className="container mt-3">
              <div className="alert alert-danger" role="alert">
                {errorMsg}
              </div>
            </div>
          )}

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
