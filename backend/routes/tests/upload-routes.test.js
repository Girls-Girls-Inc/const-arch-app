// backend/routes/__tests__/upload-routes.test.js

const express = require("express");
const request = require("supertest");

// Stub the controller functions
jest.mock("../../controllers/uploadController", () => ({
  addUpload: (req, res) => res.status(201).json({ message: "addUpload hit" }),
  deleteUpload: (req, res) => res.status(200).json({ message: "deleteUpload hit" }),
  handleSearch: (req, res) => res.status(200).json({ message: "handleSearch hit" }),
}));

const { routes: uploadRoutes } = require("../upload-routes");

const app = express();
app.use(express.json());
app.use("/api", uploadRoutes);

describe("upload-routes", () => {
  it("POST /upload should call addUpload", async () => {
    const res = await request(app).post("/api/upload").send({});
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "addUpload hit" });
  });

  it("DELETE /uploads/:id should call deleteUpload", async () => {
    const res = await request(app).delete("/api/uploads/123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "deleteUpload hit" });
  });

  it("GET /upload should call handleSearch", async () => {
    const res = await request(app).get("/api/upload");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "handleSearch hit" });
  });
});
