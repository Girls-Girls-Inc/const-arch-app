// "use client";
// import { useUser } from "../context/userContext";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { handleLogout } from "../Firebase/authorisation";
// import "../index.css";
// import IconButton from "../components/IconButton";

// const Bookmarks = () => {
//   const { user, loading, setUser } = useUser();
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     if (!loading && !user) {
//       navigate("/signIn");
//     }
//   }, [user, loading, navigate]);

//   if (loading) return <p className="loading-message">Loading...</p>;
//   if (!user) return null;

//     const [bookmarks, setBookmarks] = useState([
//         {
//         id: "1",
//         title: "Treaty of Westphalia",
//         date: "1648-10-24",
//         description: "A series of peace treaties ending the Thirty Years' War.",
//         image: "https://via.placeholder.com/120x80.png?text=Westphalia",
//         },
//         {
//         id: "2",
//         title: "Magna Carta",
//         date: "1215-06-15",
//         description: "A charter of rights agreed to by King John of England.",
//         image: "https://via.placeholder.com/120x80.png?text=Magna+Carta",
//         },
//     ]);

//   return (
//     <main>
//       {/* Hamburger only visible on mobile */}
//       <button
//         className="hamburger-btn"
//         onClick={() => setMenuOpen((prev) => !prev)}
//       >
//         ☰
//       </button>

//       <section className={`dashboard-container`}>
//         <section
//           className={`dashboard-container-lefty ${menuOpen ? "open" : ""}`}
//         >
//           <section className="nav-top">
//             <IconButton
//               icon={"account_circle"}
//               label="My Profile"
//               route="/dashboard"
//             />
//             <IconButton
//               icon={"bookmark"}
//               label="Bookmarks"
//               route="/bookmarks"
//             />
//             <IconButton icon={"folder"} label="Directory" route="/directory" />
//           </section>

//           <section className="nav-bottom">
//             <IconButton onClick={() => handleLogout(setUser)} label="Log Out" />
//             <IconButton icon={"settings"} label="Settings" route="/settings" />
//           </section>
//         </section>

//         <section className="dashboard-container-righty">
//             <section>
//                 <h2 style={{ color: "#007749" }}>
//                     Bookmarks
//                 </h2>
//             </section>
//             <section className="bookmark-grid">
//                 {bookmarks.map((bookmark) => (
//                     <article key={bookmark.id} className="bookmark-card">
//                     <img src={bookmark.image} alt={bookmark.title} className="bookmark-image" />
//                     <div className="bookmark-info">
//                         <h3 className="bookmark-title">{bookmark.title}</h3>
//                         <p className="bookmark-date">{new Date(bookmark.date).toDateString()}</p>
//                         <p className="bookmark-description">{bookmark.description}</p>
//                     </div>
//                     </article>
//         ))}
//         </section>
//         </section>
//       </section>
//     </main>
//   );
// };

// export default Bookmarks;

"use client";
import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../Firebase/authorisation";
import "../index.css";
import IconButton from "../components/IconButton";
import InputImage from "../components/InputImage";
import BookMarksContent from "../components/BookMarksContent";

const Bookmarks = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, loading, navigate]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!user) return null;

  return (
    <main>
      <button
        className="hamburger-btn_ca d-md-none"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-dropdown-nav d-md-none">
          <IconButton
            icon={"account_circle"}
            label="My Profile"
            route="/dashboard"
          />
          <IconButton icon={"bookmark"} label="Bookmarks" route="/bookmarks" />
          <IconButton icon={"folder"} label="Directory" route="/directory" />
          <IconButton
            onClick={() => handleLogout(setUser)}
            icon={"logout"}
            label="Log Out"
          />
          <IconButton icon={"settings"} label="Settings" route="/settings" />
        </div>
      )}

      <section className="dashboard-container">
        {/* Sidebar only visible on md and up */}
        <section className="dashboard-container-lefty d-none d-md-flex">
          <section className="nav-top">
            <IconButton
              icon={"account_circle"}
              label="My Profile"
              route="/dashboard"
            />
            <IconButton
              icon={"bookmark"}
              label="Bookmarks"
              route="/bookmarks"
            />
            <IconButton icon={"folder"} label="Directory" route="/directory" />
          </section>

          <section className="nav-bottom">
            <IconButton
              onClick={() => handleLogout(setUser)}
              icon={"logout"}
              label="Log Out"
            />
            <IconButton icon={"settings"} label="Settings" route="/settings" />
          </section>
        </section>

        <section className="dashboard-container-righty">
          <BookMarksContent />
        </section>
      </section>
    </main>
  );
};

export default Bookmarks;
