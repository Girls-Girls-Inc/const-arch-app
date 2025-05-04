import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useUser } from "../context/userContext";
import toast from "react-hot-toast";

export default function EmailLinkHandler() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          email = window.prompt("Please provide your email to complete sign-in");
        }

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem("emailForSignIn");
          setUser(result.user);
          toast.success("Successfully verified and signed in!");
          navigate("/dashboard");
        } catch (err) {
          console.error("Sign-in failed", err);
          toast.error("Verification link invalid or expired.");
          navigate("/signin");
        }
      } else {
        toast.error("Invalid sign-in link.");
        navigate("/signin");
      }
    };

    completeSignIn();
  }, [auth, setUser, navigate]);

  return <p className="text-center mt-10">Completing sign-in...</p>;
}