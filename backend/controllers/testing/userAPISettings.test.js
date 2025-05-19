const request = require("supertest");
const app = require("../../../app");

process.env.NODE_ENV = 'test';

// Mock firebase-admin
jest.mock("firebase-admin", () => {
  const mockVerifyIdToken = jest.fn((token) => {
    if (token === "mocked_token") return Promise.resolve({ uid: "12345" });
    return Promise.reject(new Error("Invalid token"));
  });

  const mockUpdateUser = jest.fn((uid, data) => {
    if (uid && data) return Promise.resolve({ uid, ...data });
    return Promise.reject(new Error("Missing data"));
  });

  const mockCert = jest.fn(() => ({
    projectId: "mocked-project-id",
    privateKey: "mocked-private-key",
    clientEmail: "mocked-email@example.com",
  }));

  // Mocking firestore
  const mockFirestore = jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(() => Promise.resolve()),
        get: jest.fn(() => Promise.resolve({ data: () => ({ mock: "data" }) })),
      })),
    })),
  }));

  return {
    auth: () => ({
      verifyIdToken: mockVerifyIdToken,
      updateUser: mockUpdateUser,
    }),
    initializeApp: jest.fn(),  // No-op for tests
    credential: { cert: mockCert },
    firestore: mockFirestore,  // Ensure firestore is mocked correctly
  };
});

describe("POST /api/settings/updateUser", () => {
  // Reset mocks before each test to ensure clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if token is missing", async () => {
    const res = await request(app).post("/api/settings/updateUser").send({});
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Unauthorized - No token provided");
  });

  it("should update user profile if authenticated", async () => {
    const res = await request(app)
      .post("/api/settings/updateUser")
      .set("Authorization", "Bearer mocked_token")
      .send({
        displayName: "newUsername",
        email: "newemail@example.com",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Profile updated successfully!");
  });

  it("should handle server errors gracefully", async () => {
    // Simulate an error in the backend, e.g., missing data for update
    const res = await request(app)
      .post("/api/settings/updateUser")
      .set("Authorization", "Bearer mocked_token")
      .send({}); // No data to update

    expect(res.status).toBe(400); // Internal Server Error should be returned
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Missing data");
  });

  it("should return 500 if Firebase error occurs", async () => {
    const mockedUpdateUser = require("firebase-admin").auth().updateUser;
    mockedUpdateUser.mockImplementationOnce(() => {
      throw new Error("Firebase error");
    });
  
    const res = await request(app)
      .post("/api/settings/updateUser")
      .set("Authorization", "Bearer mocked_token")
      .send({ email: "test@example.com" });
  
    expect(res.status).toBe(500);
    expect(res.body.error).toContain("Update failed: Firebase error");
  });
});