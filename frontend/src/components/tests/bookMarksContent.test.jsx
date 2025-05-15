import React from "react";
import { render, screen } from "@testing-library/react";
import BookmarksContent from "../BookMarksContent";

describe("BookmarksContent", () => {
  it("renders the heading", () => {
    render(<BookmarksContent />);
    const heading = screen.getByRole("heading", { name: /Bookmarks/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders all bookmarks", () => {
    render(<BookmarksContent />);
    
    const cards = screen.getAllByRole("article");
    expect(cards.length).toBe(3);

    expect(screen.getByText("South African Constitution")).toBeInTheDocument();
    expect(screen.getByText("Magna Carta")).toBeInTheDocument();
    expect(screen.getByText("Treaty of Westphalia")).toBeInTheDocument();
  });

  it("renders bookmark dates correctly", () => {
    render(<BookmarksContent />);
    expect(screen.getByText("Wed May 08 1996")).toBeInTheDocument();
    expect(screen.getByText("Mon Jun 15 1215")).toBeInTheDocument();
    expect(screen.getByText("Sat Oct 24 1648")).toBeInTheDocument();
  });

  it("renders bookmark descriptions", () => {
    render(<BookmarksContent />);
    expect(
      screen.getByText("The supreme law of the Republic of South Africa.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("A charter of rights agreed to by King John of England.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("A series of peace treaties ending the Thirty Years' War.")
    ).toBeInTheDocument();
  });

  it("renders images with alt text", () => {
    render(<BookmarksContent />);
    expect(screen.getByAltText("South African Constitution")).toBeInTheDocument();
    expect(screen.getByAltText("Magna Carta")).toBeInTheDocument();
    expect(screen.getByAltText("Treaty of Westphalia")).toBeInTheDocument();
  });
});