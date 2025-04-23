const request = require("supertest");
const { expect } = require("@jest/globals");
const app = require("../server"); // Your Express app

describe("POST /api/user/update-profile", () => {
    it("should return 401 if token is missing", async () => {
        const res = await request(app).post("/api/user/update-profile").send({});
        expect(res.status).to.equal(401);
    });

    it("should update user profile if authenticated", async () => {
        const fakeToken = "your_test_firebase_token"; // You can mock Firebase admin SDK for testing

        const res = await request(app)
            .post("/api/user/update-profile")
            .set("Authorization", `Bearer ${fakeToken}`)
            .send({
                uid: "12345",
                displayName: "newUsername",
                email: "newemail@example.com",
            });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
    });
});
