// backend/controllers/testing/settingsUpdate.test.js

// 1) Mock the same "../db" module that both verifyToken.js and settingsUpdate.js import
let mockVerifyIdToken;
let mockUpdateUser;

jest.mock("../../db", () => {
  mockVerifyIdToken = jest.fn();
  mockUpdateUser = jest.fn();
  return {
    admin: {
      auth: () => ({
        verifyIdToken: mockVerifyIdToken,
        updateUser: mockUpdateUser,
      }),
    },
  };
});

// 2) Now import supertest & your express app
const request = require("supertest");
const app = require("../../../app");

describe("POST /api/settings/updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 if no Authorization header", async () => {
    const res = await request(app)
      .post("/api/settings")
      .send({}); // no Authorization header
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized - No token provided" });
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("returns 401 if token is invalid", async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error("Invalid token"));

    const res = await request(app)
      .post("/api/settings")
      .set("Authorization", "Bearer bad_token")
      .send({});

    expect(mockVerifyIdToken).toHaveBeenCalledWith("bad_token");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized - Invalid token" });
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("returns 400 if authenticated but no update fields provided", async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: "user123" });

    const res = await request(app)
      .post("/api/settings")
      .set("Authorization", "Bearer good_token")
      .send({}); // empty body

    expect(mockVerifyIdToken).toHaveBeenCalledWith("good_token");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing data" });
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("returns 200 and calls updateUser with only provided fields", async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: "user123" });
    mockUpdateUser.mockResolvedValue({ uid: "user123" });

    const payload = { email: "x@example.com", displayName: "X" };
    const res = await request(app)
      .post("/api/settings")
      .set("Authorization", "Bearer good_token")
      .send(payload);

    expect(mockVerifyIdToken).toHaveBeenCalledWith("good_token");
    expect(mockUpdateUser).toHaveBeenCalledWith("user123", {
      email: "x@example.com",
      displayName: "X",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Profile updated successfully!" });
  });

  it("returns 500 if updateUser throws a Firebase error", async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: "user123" });
    mockUpdateUser.mockRejectedValue(new Error("Firebase exploded"));

    const res = await request(app)
      .post("/api/settings")
      .set("Authorization", "Bearer good_token")
      .send({ newPassword: "pw" });

    expect(mockVerifyIdToken).toHaveBeenCalledWith("good_token");
    expect(mockUpdateUser).toHaveBeenCalledWith("user123", { password: "pw" });
    expect(res.status).toBe(500);
    expect(res.body.error).toContain("Update failed: Firebase exploded");
  });
});
