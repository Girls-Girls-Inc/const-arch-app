// backend/routes/__tests__/bookmark-routes.test.js

const express = require("express");
const request = require("supertest");

// Mock the controller functions
const addBookmark = jest.fn((req, res) => res.status(201).json({ message: "Bookmark added" }));
const removeBookmark = jest.fn((req, res) => res.status(200).json({ message: "Bookmark removed" }));

// Mock the controller module
jest.mock("../../controllers/bookmarkController", () => ({
  addBookmark: jest.fn((req, res) => res.status(201).json({ message: "Bookmark added" })),
  removeBookmark: jest.fn((req, res) => res.status(200).json({ message: "Bookmark removed" })),
}));

// Import the actual routes
const { routes: bookmarkRoutes } = require("../bookmark-routes");

const app = express();
app.use(express.json());
app.use("/api", bookmarkRoutes); // mount at /api

describe("bookmark-routes", () => {
  it("POST /api/bookmark should call addBookmark", async () => {
    const res = await request(app)
      .post("/api/bookmark")
      .send({ itemId: "abc123" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Bookmark added" });
    expect(addBookmark).toHaveBeenCalled();
  });

  it("DELETE /api/bookmark/:id should call removeBookmark", async () => {
    const res = await request(app).delete("/api/bookmark/abc123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Bookmark removed" });
    expect(removeBookmark).toHaveBeenCalled();
  });
});
