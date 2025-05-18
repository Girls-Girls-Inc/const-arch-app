// backend/routes/__tests__/settings-routes.test.js

const express = require("express");
const request = require("supertest");

// Mock the settingsUpdate controller's router
jest.mock("../../controllers/settingsUpdate", () => {
  const express = require("express");
  const router = express.Router();

  // Fake endpoint to confirm the router is mounted correctly
  router.post("/updateUser", (req, res) => {
    return res.status(200).json({ message: "Stub route hit" });
  });

  return { router };
});

const { routes: settingsRoutes } = require("../settings-routes");

const app = express();
app.use(express.json());
app.use("/api", settingsRoutes);

describe("settings-routes", () => {
  it("should delegate to settingsUpdate router for POST /settings/updateUser", async () => {
    const res = await request(app)
      .post("/api/settings/updateUser")
      .send({ displayName: "Test" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Stub route hit" });
  });
});
