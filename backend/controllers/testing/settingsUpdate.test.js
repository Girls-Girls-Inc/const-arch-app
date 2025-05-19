// backend/controllers/testing/settingsUpdate.test.js

const express = require("express");
const supertest = require("supertest");

let mockUpdateUser;
// 1) Mock the backend/db module so admin.auth().updateUser is stubbed
jest.mock("../../db", () => {
  mockUpdateUser = jest.fn();
  return {
    admin: {
      auth: () => ({
        updateUser: mockUpdateUser,
      }),
    },
  };
});

// 2) Stub out the verifyToken middleware to always set req.user.uid
jest.mock("../verifyToken", () => {
  return (req, res, next) => {
    req.user = { uid: "user123" };
    next();
  };
});

// 3) Import your router and spin up a minimal express app
const { router } = require("../settingsUpdate");
const app = express();
app.use(express.json());
app.use("/api/settings", router);
const request = supertest(app);

describe("POST /api/settings/updateUser", () => {
  beforeEach(() => {
    mockUpdateUser.mockReset();
  });

  it("should return 400 if no fields provided", async () => {
    const res = await request.post("/api/settings/updateUser").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing data" });
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("should update email and displayName and return 200", async () => {
    mockUpdateUser.mockResolvedValue({});
    const payload = { email: "x@example.com", displayName: "X" };

    const res = await request
      .post("/api/settings/updateUser")
      .send(payload);

    expect(mockUpdateUser).toHaveBeenCalledWith("user123", {
      email: payload.email,
      displayName: payload.displayName,
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Profile updated successfully!" });
  });

  it("should update password only when newPassword is provided", async () => {
    mockUpdateUser.mockResolvedValue({});
    const payload = { newPassword: "secret" };

    const res = await request
      .post("/api/settings/updateUser")
      .send(payload);

    expect(mockUpdateUser).toHaveBeenCalledWith("user123", {
      password: payload.newPassword,
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Profile updated successfully!" });
  });

  it("should return 500 if updateUser throws", async () => {
    mockUpdateUser.mockRejectedValue(new Error("Firebase exploded"));
    const payload = { displayName: "Y" };

    const res = await request
      .post("/api/settings/updateUser")
      .send(payload);

    expect(mockUpdateUser).toHaveBeenCalledWith("user123", {
      displayName: payload.displayName,
    });
    expect(res.status).toBe(500);
    expect(res.body.error).toContain("Update failed: Firebase exploded");
  });
});
