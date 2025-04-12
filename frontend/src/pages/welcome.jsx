import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation
import { useUser } from "../context/UserContext";

export default function WelcomePage() {
  const { user } = useUser();
  const navigate = useNavigate(); // useNavigate instead of useRouter

  useEffect(() => {
    if (!user) {
      navigate("/signup"); // redirect to signup if no user
    }
  }, [user, navigate]); // Add navigate to dependency array

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
