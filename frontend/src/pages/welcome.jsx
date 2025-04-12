"use client";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signup"); // redirect to login if no user
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
