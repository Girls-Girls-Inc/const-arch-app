import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import InputField from "../components/InputField";
import PasswordInputField from "../components/PasswordInputField";
import { withProvider, signInWithEmail, forgotPassword } from "../Firebase/authorisation";
import { googleProvider } from "../Firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import { getAuth } from "firebase/auth";

export default function SigninPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginWithEmail = async () => {
    const user = await signInWithEmail(email, password);
    if (!user.emailVerified) {
      await getAuth().signOut();
      throw new Error("Email not verified. Please check your inbox.");
    }
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
        if (err?.message === "Email not verified. Please check your inbox.") {
          message = err.message;
        } else if (err?.code === "auth/invalid-credential") {
          message = "Email or Password is incorrect!";
        } else {
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

        <section className="social-login" aria-label="Social Login">
          <button onClick={handleGoogleSignIn} className="social-button">
            <img
              src="/icons/google.svg"
              alt="Google Icon"
              className="social-icon"
            />
            Google
          </button>
        </section>

        <p className="seperator" role="presentation">
          <span>or</span>
        </p>

        <form onSubmit={LoginButton} className="login-form" aria-label="Email Login Form">
          <fieldset>
            <legend className="visually-hidden">Login Credentials</legend>

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
          </fieldset>

          {errorMsg && (
            <aside role="alert" className="alert alert-danger mt-3">
              {errorMsg}
            </aside>
          )}

          <nav>
            <a
              href="#"
              className="forgot-password-link"
              onClick={() => forgotPassword(email)}
            >
              Forgot Password?
            </a>
          </nav>

          <button className="login-button" type="submit">
            Login
          </button>

          <footer>
            <p className="signup-text">
              Don&apos;t have an account? <Link to="/signup">Signup Instead</Link>
            </p>
          </footer>
        </form>

      </div>
    </main>
  );
}
