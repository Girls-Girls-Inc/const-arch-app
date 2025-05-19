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
  const { user, loading, setUser, isAdmin } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          toast.loading("Fetching user data...");
          const colRef = collection(db, "users");
          const snapshot = await getDocs(colRef);
          const usersList = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
          }));
          setUsers(usersList);
          toast.dismiss();
          toast.success("Users loaded successfully!");
        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to fetch user data");
        } finally {
          setUsersLoading(false);
        }
      };

      fetchUsers();
    }
  }, [isAdmin]);

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
      console.error("Error updating admin status:", error);
      toast.error("Failed to update admin status");
    }
  };

  return (
    <main>
      <Toaster position="top-center" reverseOrder={false} />
      <NavigationComponent />

      <section className="dashboard-container">
        <NavigationDashLeft />

        <section className="dashboard-container-righty">
          <main className="dashboard-details">
            <h2 className="right-title">Manage users:</h2>

            <div
              className="table-responsive"
              style={{ maxHeight: "65vh", overflowY: "auto" }}
            >
              {!loading && !isAdmin && (
                <p>You do not have permission to view this page.</p>
              )}

              {!loading && isAdmin && !usersLoading && users.length > 0 && (
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
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input bg-success border-success"
                              type="checkbox"
                              role="switch"
                              id={`adminSwitch-${user.id}`}
                              checked={user.isAdmin}
                              onChange={() =>
                                handleAdminToggle(user.id, user.isAdmin)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`adminSwitch-${user.id}`}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </section>
      </section>
    </main>
  );
};

export default ManageUsers;
