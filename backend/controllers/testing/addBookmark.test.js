if (typeof setImmediate === "undefined") {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

const { addBookmark } = require("../bookmarkController");

const mockSet = jest.fn();
const mockDoc = jest.fn(() => ({ set: mockSet }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));

jest.mock("../../db", () => ({
  db: {
    collection: jest.fn(),
  },
}));

const { db } = require("../../db");

describe("addBookmark", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.collection.mockImplementation(mockCollection);
  });

  test("successfully saves a bookmark", async () => {
    const req = {
      body: { title: "Test Bookmark", url: "https://example.com" },
    };

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await addBookmark(req, res);

    expect(db.collection).toHaveBeenCalledWith("bookmark");
    expect(mockDoc).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalledWith(req.body);
    expect(res.send).toHaveBeenCalledWith("Bookmark saved successfully!");
  });

  test("handles Firestore error", async () => {
    mockSet.mockImplementationOnce(() => {
      throw new Error("Firestore failure");
    });

    const req = { body: { title: "Broken", url: "https://fail.com" } };
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await addBookmark(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Firestore failure");
  });
});