const request = require("supertest");
const app = require("../backend/app");

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

    return {
        auth: () => ({
            verifyIdToken: mockVerifyIdToken,
            updateUser: mockUpdateUser,
        }),
        initializeApp: jest.fn(),
        credential: {
            applicationDefault: jest.fn(),
        },
    };
});

describe("POST /api/settings/updateUser", () => {
    it("should return 401 if token is missing", async () => {
        const res = await request(app).post("/api/settings/updateUser").send({});
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Authorization token is required");
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

        expect(res.status).toBe(500);  // Internal Server Error should be returned
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Missing data");
    });
});
