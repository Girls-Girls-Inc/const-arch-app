import { Link } from "react-router-dom";
import "../index.css";

export default function Home() {
  return (
    <main>
      <h1>Welcome to GG inc</h1>
      <div>
        <p>Links to current Pages:</p>
        <br></br>
        <Link className="btn" to="/signIn">
          Sign In
        </Link>
        <Link className="btn" to="/signUp">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
