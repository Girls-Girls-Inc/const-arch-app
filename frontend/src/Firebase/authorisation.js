import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  getAuth,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import axios from "axios";
import { toast } from "react-hot-toast";

const HOST_URL = process.env.VITE_API_HOST_URL || 'https://fallback-url.com';

// Helper to format the Firebase user to match backend expectations
const formatUserForBackend = (user) => ({
  id: user.uid,
  name: user.displayName || "",
  email: user.email,
  photoURL: user.photoURL || "",
});

export async function signUpWithEmail(email, password, name) {

  const actionCodeSettings = {
    url: 'http://localhost:4001/verify-link',
    handleCodeInApp: true,
  };

  if(!email){
    throw new Error("Email cannot be empty");
  }else if(!password){
    throw new Error("Password cannot be empty");
  }
  
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
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    toast.success("Verification email sent. Please check your inbox.");
  } catch (err) {
    console.error("Error sending verification email:", err.message);
    toast.error("Failed to send verification email.");
  }

  await axios.post(`${HOST_URL}/api/user`,  formatUserForBackend(user));


  return user;
}


export async function signInWithEmail(email, password) {
  if (!email) throw new Error("Email cannot be empty");
  if (!password) throw new Error("Password cannot be empty");

  const userCredentials = await signInWithEmailAndPassword(auth, email, password);
  return userCredentials.user;
}

export async function withProvider(provider) {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    const formattedUser = formatUserForBackend(user);
    await axios.post(`${HOST_URL}/api/user`, formattedUser);
  }

  return user;
}

export const handleLogout = async (setUser) => {
  const userAuth = getAuth();
  try {
    await signOut(userAuth);
    setUser(null);
    console.log("User signed out.");
    toast.success("Successfully signed out", {
      duration: 4000,
      position: "top-right",
    });
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
