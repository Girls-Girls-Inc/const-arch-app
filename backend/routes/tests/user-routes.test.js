// backend/routes/__tests__/user-routes.test.js

const express = require("express");
const request = require("supertest");

// Stub controller functions
jest.mock("../../controllers/userController", () => ({
  addUser: (req, res) => res.status(201).json({ message: "addUser hit" }),
  deleteUser: (req, res) => res.status(200).json({ message: "deleteUser hit" }),
  updateUser: (req, res) => res.status(200).json({ message: "updateUser hit" }),
  replaceUser: (req, res) => res.status(200).json({ message: "replaceUser hit" }),
}));

const { routes: userRoutes } = require("../user-routes");

const app = express();
app.use(express.json());
app.use("/api", userRoutes);

describe("user-routes", () => {
  it("POST /user should call addUser", async () => {
    const res = await request(app).post("/api/user").send({});
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "addUser hit" });
  });

  it("DELETE /user/:id should call deleteUser", async () => {
    const res = await request(app).delete("/api/user/abc");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "deleteUser hit" });
  });

  it("PATCH /user/:id should call updateUser", async () => {
    const res = await request(app).patch("/api/user/abc").send({});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "updateUser hit" });
  });

  it("PUT /user/:id should call replaceUser", async () => {
    const res = await request(app).put("/api/user/abc").send({});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "replaceUser hit" });
  });
});
