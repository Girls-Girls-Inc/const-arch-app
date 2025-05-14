/*import React, { useState, useEffect } from "react";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import toast, { Toaster } from "react-hot-toast";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const BookmarkPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookmarkedDocs, setBookmarkedDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchBookmarkedDocuments = async () => {
      if (!user) return;

      try {
        const bookmarkRef = doc(db, "bookmark", user.uid);
        const bookmarkSnap = await getDoc(bookmarkRef);

        if (bookmarkSnap.exists()) {
          const { documentIds } = bookmarkSnap.data();
          if (documentIds && documentIds.length > 0) {
            const docsSnapshot = await getDocs(collection(db, "upload"));
            const allDocs = docsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            const filteredDocs = allDocs.filter((doc) =>
              documentIds.includes(doc.id)
            );

            setBookmarkedDocs(filteredDocs);
          } else {
            setBookmarkedDocs([]);
          }
        } else {
          setBookmarkedDocs([]);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedDocuments();
  }, [user]);

  const getFileTypeIcon = (filePath) => {
    const extension = filePath.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "picture_as_pdf";
    if (["doc", "docx"].includes(extension)) return "description";
    if (["ppt", "pptx"].includes(extension)) return "slideshow";
    if (["xls", "xlsx"].includes(extension)) return "table_chart";
    return "insert_drive_file";
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main>
      <Toaster position="top-right" reverseOrder={false} />
      <NavigationComponent />
      <section className="dashboard-container">
        <NavigationDashLeft />
        <section className="dashboard-container-righty">
          <main className="dashboard-details w-100">
            <h2 className="right-title mb-4">My Bookmarks</h2>

            {loading ? (
              <p>Loading bookmarks...</p>
            ) : bookmarkedDocs.length > 0 ? (
              <section className="document-list">
                {bookmarkedDocs.map((doc) => {
                  const icon = getFileTypeIcon(doc.filePath);
                  return (
                    <article
                      key={doc.id}
                      className="document-card d-flex align-items-start p-3 mb-3 border rounded shadow-sm"
                      onClick={() => window.open(doc.filePath, "_blank")}
                    >
                      <i
                        className="material-symbols-outlined me-3"
                        style={{ fontSize: "48px", color: "#007847" }}
                      >
                        {icon}
                      </i>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{doc.fileName}</h5>
                        <small className="text-muted">
                          Date: {formatDate(doc.uploadDate)}
                        </small>
                        <div className="d-flex flex-wrap gap-1 mt-2">
                          {doc.tags?.map((tag, idx) => (
                            <span key={idx} className="badge bg-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : (
              <p>You have no bookmarks yet.</p>
            )}
          </main>
        </section>
      </section>
    </main>
  );
};

export default BookmarkPage;*/
import React, { useState, useEffect } from "react";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import "../index.css";
import { collection, getDocs, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const BookmarksPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/signIn");
    } else {
      const fetchBookmarks = async () => {
        try {
          const bookmarkRef = doc(db, "bookmark", user.uid);
          const bookmarkSnap = await getDoc(bookmarkRef);

          if (bookmarkSnap.exists()) {
            const ids = bookmarkSnap.data().documentIds || [];
            setBookmarkedIds(ids);

            if (ids.length > 0) {
              const allDocsSnap = await getDocs(collection(db, "upload"));
              const allDocs = allDocsSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              const filteredDocs = allDocs.filter((doc) => ids.includes(doc.id));
              setDocuments(filteredDocs);
            }
          }
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
          toast.error("Failed to load bookmarks.");
        } finally {
          setLoading(false);
        }
      };

      fetchBookmarks();
    }
  }, [user, navigate]);

  const getFileTypeIcon = (filePath) => {
    const extension = filePath.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "picture_as_pdf";
    if (["doc", "docx"].includes(extension)) return "description";
    if (["ppt", "pptx"].includes(extension)) return "slideshow";
    if (["xls", "xlsx"].includes(extension)) return "table_chart";
    return "insert_drive_file";
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRemoveBookmark = async (docId, docName) => {
    if (!user) return;

    try {
      const bookmarkRef = doc(db, "bookmark", user.uid);
      await updateDoc(bookmarkRef, {
        documentIds: arrayRemove(docId),
      });

      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      toast.success(`Removed bookmark for "${docName}"`);
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark.");
    }
  };

  return (
    <main>
      <Toaster position="top-right" reverseOrder={false} />
      <NavigationComponent />
      <section className="dashboard-container">
        <NavigationDashLeft />
        <section className="dashboard-container-righty">
          <main className="dashboard-details w-100">
            <h2 className="right-title mb-4">My Bookmarks</h2>

            {loading ? (
              <p>Loading bookmarks...</p>
            ) : documents.length > 0 ? (
              <section className="document-list">
                {documents.map((doc) => {
                  const icon = getFileTypeIcon(doc.filePath);
                  return (
                    <article
                      key={doc.id}
                      className="document-card d-flex align-items-start p-3 mb-3 border rounded shadow-sm"
                      onClick={() => window.open(doc.filePath, "_blank")}
                    >
                      <i
                        className="material-symbols-outlined me-3"
                        style={{ fontSize: "48px", color: "#007847" }}
                      >
                        {icon}
                      </i>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{doc.fileName}</h5>
                        <small className="text-muted">
                          Date: {formatDate(doc.uploadDate)}
                        </small>
                        <div className="d-flex flex-wrap gap-1 mt-2">
                          {doc.tags?.map((tag, idx) => (
                            <span key={idx} className="badge bg-secondary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        className="bookmark-doc"
                        style={{
                          borderColor: "#777",
                          color: "red",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBookmark(doc.id, doc.fileName);
                        }}
                      >
                        <i className="material-symbols-outlined">bookmark</i>
                      </button>
                    </article>
                  );
                })}
              </section>
            ) : (
              <p>No bookmarks found.</p>
            )}
          </main>
        </section>
      </section>
    </main>
  );
};

export default BookmarksPage;