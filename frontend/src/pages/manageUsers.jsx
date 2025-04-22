"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../Firebase/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const checkIfAdminAndFetchUsers = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log("No user signed in");
        setIsAdmin(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsAdmin(userData.isAdmin);

          if (userData.isAdmin) {
            const colRef = collection(db, "users");
            const snapshot = await getDocs(colRef);
            const usersList = snapshot.docs.map((docSnap) => ({
              ...docSnap.data(),
              id: docSnap.id,
            }));
            setUsers(usersList);
          }
        } else {
          console.log("User document not found");
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkIfAdminAndFetchUsers();
  }, []);

  const handleAdminToggle = async (userId, currentValue) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isAdmin: !currentValue });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdmin: !currentValue } : user
        )
      );
    } catch (error) {
      console.error("Error updating isAdmin field:", error);
    }
  };

  if (isAdmin === null) return <p>Checking admin status...</p>;
  if (!isAdmin) return <p>You do not have permission to view this page.</p>;

  return (
    <div className="user-table-container">
      <h2 className="title-admin">All Users:</h2>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.isAdmin}
                    onChange={() => handleAdminToggle(user.id, user.isAdmin)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
}

export default ManageUsers;
