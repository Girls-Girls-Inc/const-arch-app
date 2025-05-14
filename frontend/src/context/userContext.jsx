import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser || null);
          setLoading(false);

          if (firebaseUser) {
            try {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              if (userDoc.exists()) {
                const data = userDoc.data();
                setIsAdmin(data.isAdmin === true);
              } else {
                setIsAdmin(false);
              }
            } catch (error) {
              console.error("Failed to fetch admin status:", error);
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
        });

        return unsubscribe;
      })
      .catch((error) => {
        console.error("Persistence error:", error);
      });
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
