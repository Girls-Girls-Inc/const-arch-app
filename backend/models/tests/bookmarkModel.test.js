import Bookmark from "../bookmark";

describe("Bookmark Model", () => {
  it("should correctly assign properties when instantiated", () => {
    const id = "1";
    const userId = "user123";
    const fileId = "file456";
    const bookmarkedAt = new Date().toISOString();

    const bookmark = new Bookmark(id, userId, fileId, bookmarkedAt);

    expect(bookmark).toBeInstanceOf(Bookmark);
    expect(bookmark.id).toBe(id);
    expect(bookmark.userId).toBe(userId);
    expect(bookmark.fileId).toBe(fileId);
    expect(bookmark.bookmarkedAt).toBe(bookmarkedAt);
  });
});