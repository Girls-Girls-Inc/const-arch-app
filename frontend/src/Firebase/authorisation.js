import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  signOut,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { auth } from "./firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const HOST_URL = process.env.VITE_API_HOST_URL || "https://fallback-url.com";

// Helper to format the Firebase user to match backend expectations
const formatUserForBackend = (user) => ({
  id: user.uid,
  name: user.displayName || "",
  email: user.email,
  photoURL: user.photoURL || "",
});

export async function signUpWithEmail(email, password, name) {
  if (!email) throw new Error("Email cannot be empty");
  if (!password) throw new Error("Password cannot be empty");

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  if (name) {
    await updateProfile(user, { displayName: name });
  }

  try {
    await sendEmailVerification(user);
    toast.success("Verification email sent. Please check your inbox.");
  } catch (err) {
    console.error("Error sending verification email:", err.message);
    toast.error("Failed to send verification email.");
  }

  try {
    // Send user data to backend to create Firestore entry
    const formattedUser = formatUserForBackend(user);
    await axios.post(`${HOST_URL}/api/user`, formattedUser);
    console.log("User saved to Firestore.");
  } catch (err) {
    console.error("Error syncing user to backend:", err.message);
  }

  return user;
}

export async function signInWithEmail(email, password) {
  if (!email) throw new Error("Email cannot be empty");
  if (!password) throw new Error("Password cannot be empty");

  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredentials.user;
}

export async function withProvider(provider) {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!user || !user.uid) {
    throw new Error("No user returned from provider.");
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    const formattedUser = formatUserForBackend(user);
    // await axios.post(`${HOST_URL}/api/user`, formattedUser);
    try {
      await axios.post(`${HOST_URL}/api/user`, formattedUser);
      console.log("OAuth user saved to Firestore.");
    } catch (err) {
      console.error("Error syncing OAuth user:", err.message);
    }
  }

  return user;
}

export const handleLogout = async (setUser, navigate) => {
  const userAuth = getAuth();
  try {
    await signOut(userAuth);
    setUser(null);
    console.log("User signed out.");
    toast.success("Successfully signed out", {
      duration: 4000,
      position: "top-right",
    });
    navigate("/");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
