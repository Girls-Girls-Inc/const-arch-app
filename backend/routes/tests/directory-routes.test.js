// backend/routes/__tests__/directory-routes.test.js

const express = require("express");
const request = require("supertest");

// Mock controller functions
const addDirectory = jest.fn((req, res) =>
  res.status(201).json({ message: "Directory added" })
);
const deleteDirectory = jest.fn((req, res) =>
  res.status(200).json({ message: "Directory deleted" })
);

// Mock the controller module
jest.mock("../../controllers/directoryController", () => ({
  addDirectory: jest.fn((req, res) =>
    res.status(201).json({ message: "Directory added" })
  ),
  deleteDirectory: jest.fn((req, res) =>
    res.status(200).json({ message: "Directory deleted" })
  ),
}));

// Import route under test
const { routes: directoryRoutes } = require("../directory-routes");

const app = express();
app.use(express.json());
app.use("/api", directoryRoutes); // mount under /api

describe("directory-routes", () => {
  it("POST /api/directory should call addDirectory", async () => {
    const res = await request(app).post("/api/directory").send({
      name: "New Folder",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Directory added" });
    expect(addDirectory).toHaveBeenCalled();
  });

  it("DELETE /api/directory/:id should call deleteDirectory", async () => {
    const res = await request(app).delete("/api/directory/abc123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Directory deleted" });
    expect(deleteDirectory).toHaveBeenCalled();
  });
});
