"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import NavigationDashLeft from "../components/NavigationDashLeft";
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
import { Toaster, toast } from "react-hot-toast";

const ManageUsers = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
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
            const promise = getDocs(colRef).then((snapshot) => {
              const usersList = snapshot.docs.map((docSnap) => ({
                ...docSnap.data(),
                id: docSnap.id,
              }));
              setUsers(usersList);
            });

            await toast.promise(promise, {
              loading: "Fetching users...",
              success: "Users loaded successfully!",
              error: "Failed to load users",
            });
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

      toast.success(
        `User is now ${!currentValue ? "an admin" : "not an admin"}`
      );
    } catch (error) {
      console.error("Error updating isAdmin field:", error);
      toast.error("Failed to update admin status");
    }
  };

  if (loading || isAdmin === null)
    return <p className="loading-message">Loading...</p>;
  if (!isAdmin) return <p>You do not have permission to view this page.</p>;

  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <NavigationComponent />

      <section className="dashboard-container">
        <NavigationDashLeft />

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <h2 className="title-admin">All Users:</h2>

            {/* Bootstrap scrollable, styled table */}
            <div
              className="table-responsive"
              style={{ maxHeight: "65vh", overflowY: "auto" }}
            >
              {users.length > 0 ? (
                <table className="table table-striped table-hover table-borderless w-100 rounded-4 overflow-hidden shadow">
                  <thead className="thead-dark bg-dark text-white">
                    <tr>
                      <th scope="col">Email</th>
                      <th scope="col">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>

                        <td>
                          <input
                            type="checkbox"
                            className="custom-checkbox"
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
            </div>
          </main>
        </section>
      </section>
    </main>
  );
};

export default ManageUsers;
