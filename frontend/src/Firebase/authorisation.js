import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";
import { toast } from "react-hot-toast";

export async function signUpWithEmail(email, password, name) {
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

  await axios.post('http://localhost:4000/api/user', user);

  return user;
}

export async function signInWithEmail(email, password) {
  if (!email) {
    throw new Error("Email cannot be empty");
  }
  if (!password) {
    throw new Error("Password cannot be empty");
  }
  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredentials.user;
}

export async function withProvider(provider) {
  const result = await signInWithPopup(auth, provider);
  await axios.post('http://localhost:4000/api/user', result.user);
  return result.user
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
