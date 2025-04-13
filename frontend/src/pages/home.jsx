import { Link } from "react-router-dom";
import "../index.css";
import logo from "../assets/logo.png"; 

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="flex justify-center mb-4">
        <img src={logo} alt="App Logo" style={{ width: "50px", height: "auto" }} />
      </div>
      <h1 className="text-3xl font-semibold mb-6">Welcome to GG inc</h1>
      <div>
        <p className="mb-4">Links to current Pages:</p>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Link className="btn" to="/signIn">
            Sign In
          </Link>
          <Link className="btn" to="/signUp">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
