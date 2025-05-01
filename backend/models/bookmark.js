class Bookmark {
  constructor(id, userId, fileId, bookmarkedAt) {
    this.id = id;
    this.userId = userId;
    this.fileId = fileId;
    this.bookmarkedAt = bookmarkedAt;
  }
}

module.exports = Bookmark;
