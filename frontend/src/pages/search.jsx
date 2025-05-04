import React, { useState, useEffect } from "react";
import NavigationComponent from "../components/NavigationComponent";
import NavigationDashLeft from "../components/NavigationDashLeft";
import IconButton from "../components/IconButton";
import InputField from "../components/InputField";
import "../index.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const SearchPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("");
  const [showTagFilter, setShowTagFilter] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "upload"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const getFileTypeIcon = (filePath) => {
    const extension = filePath.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return "picture_as_pdf";
    if (["doc", "docx"].includes(extension)) return "description";
    if (["ppt", "pptx"].includes(extension)) return "slideshow";
    if (["xls", "xlsx"].includes(extension)) return "table_chart";
    return "insert_drive_file";
  };

  const uniqueTags = Array.from(
    new Set(documents.flatMap((doc) => doc.tags || []))
  );

  const filteredDocs = documents.filter((doc) => {
    const nameMatch = doc.fileName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const tagMatch =
      selectedTag === "" || (doc.tags || []).includes(selectedTag);
    return nameMatch && tagMatch && doc.visibility === "public";
  });

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
            <h2 className="right-title mb-4">Search Documents</h2>

            <div className="search-filter-wrapper d-flex gap-3 align-items-center flex-wrap mb-3">
              <div className="flex-grow-1">
                <InputField
                  id="search-docs"
                  type="text"
                  placeholder="Search by file name..."
                  icon="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required={false}
                />
              </div>

              <IconButton
                icon="filter_alt"
                label={"Filter"}
                ariaLabel="Toggle Tag Filter"
                onClick={() => setShowTagFilter(!showTagFilter)}
              />
            </div>

            {showTagFilter && (
              <div className="tag-filter-dropdown mb-4">
                <select
                  className="form-select"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="">All Tags</option>
                  {uniqueTags.map((tag, idx) => (
                    <option key={idx} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {loading ? (
              <p>Loading documents...</p>
            ) : filteredDocs.length > 0 ? (
              <section className="document-list">
                {filteredDocs.map((doc) => {
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
                          color: "#007847",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Bookmarked "${doc.fileName}"`);
                        }}
                      >
                        <i className="material-symbols-outlined">bookmark</i>
                      </button>
                    </article>
                  );
                })}
              </section>
            ) : (
              <p>No documents found.</p>
            )}
          </main>
        </section>
      </section>
    </main>
  );
};

export default SearchPage;
