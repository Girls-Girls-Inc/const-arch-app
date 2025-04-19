import { db } from "firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

async function addUser(name, email, password) {
  try {
    const docRef = await addDoc(collection(db, "Users"), {
      email: email,
      password: password,
    });
    console.log("User added with ID:", DocumentReference.ID);
    return docRef;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}
