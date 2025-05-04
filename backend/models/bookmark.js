class Bookmark {
  constructor(id, userId, fileId, bookmarkedAt) {
    this.id = id;
    this.userId = userId; // Reference to User
    this.fileId = fileId; // Reference to Upload
    this.bookmarkedAt = bookmarkedAt;
  }
}

module.exports = Bookmark;
