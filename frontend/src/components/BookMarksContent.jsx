import React, { useState } from "react";

const BookmarksContent = () => {
  const [bookmarks] = useState([
    {
      id: "1",
      title: "South African Constitution",
      date: "1996-05-08",
      description: "The supreme law of the Republic of South Africa.",

      image: "https://picsum.photos/200",
    },
    {
      id: "2",
      title: "Magna Carta",
      date: "1215-06-15",
      description: "A charter of rights agreed to by King John of England.",
      image: "https://picsum.photos/200",
    },
    {
      id: "3",
      title: "Treaty of Westphalia",
      date: "1648-10-24",
      description: "A series of peace treaties ending the Thirty Years' War.",
      image: "https://picsum.photos/200",
    },
  ]);

  return (
    <>
      <main className="dashboard-details">
        <h2 className="right-title">Bookmarks</h2>

        <section className="bookmark-grid">
          {bookmarks.map((bookmark) => (
            <article key={bookmark.id} className="bookmark-card">
              <img
                src={bookmark.image}
                alt={bookmark.title}
                className="bookmark-image"
              />
              <div className="bookmark-info">
                <h3 className="bookmark-title">{bookmark.title}</h3>
                <p className="bookmark-date">
                  {new Date(bookmark.date).toDateString()}
                </p>
                <p className="bookmark-description">{bookmark.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
};

export default BookmarksContent;
