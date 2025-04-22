"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { getAuth } from "firebase/auth";
import NavigationComponent from "../components/NavigationComponent";

const ManageUsers = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, loading, navigate]);

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

  if (loading || isAdmin === null)
    return <p className="loading-message">Loading...</p>;
  if (!isAdmin) return <p>You do not have permission to view this page.</p>;

  return (
    <main>
      <NavigationComponent />

      <section className="dashboard-container">
        <section className="dashboard-container-lefty d-none d-md-flex">
          <section className="nav-top">
            <IconButton
              icon="account_circle"
              label="My Profile"
              route="/dashboard"
            />
            <IconButton icon="bookmark" label="Bookmarks" route="/bookmarks" />
            <IconButton icon="folder" label="Directory" route="/directory" />
            <IconButton
              icon="group"
              label="Manage Users"
              route="/manageUsers"
            />
          </section>

          <section className="nav-bottom">
            <IconButton
              onClick={() => handleLogout(setUser)}
              icon="logout"
              label="Log Out"
            />
            <IconButton icon="settings" label="Settings" route="/settings" />
          </section>
        </section>

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
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
                          onChange={() =>
                            handleAdminToggle(user.id, user.isAdmin)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Loading users...</p>
            )}
          </main>
        </section>
      </section>
    </main>
  );
};

export default ManageUsers;
