"use client";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signup"); // redirect to login if no user
    }
  }, [user]);

  return (
    <main>
      {user ? (
        <h1>
          Welcome {user.name} {user.surname}!
        </h1>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
