// backend/tests/db.test.js
const { admin, db } = require("../db");

describe("backend/db.js", () => {
  it("should export an initialized Firestore db and admin SDK", () => {
    expect(admin).toBeDefined();
    expect(typeof admin.initializeApp).toBe("function");
    expect(db).toBeDefined();
    expect(typeof db.collection).toBe("function");
  });
});
