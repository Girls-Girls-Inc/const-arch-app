class Upload {
  constructor(
    id,
    fileName,
    filePath,
    directoryId,
    uploadedBy,
    fileType,
    tags,
    uploadDate,
    visibility,
    bookmarkCount,
    updatedAt
  ) {
    this.id = id;
    this.fileName = fileName;
    this.filePath = filePath;
    this.directoryId = directoryId;
    this.uploadedBy = uploadedBy;
    this.fileType = fileType;
    this.tags = tags;
    this.uploadDate = uploadDate;
    this.visibility = visibility;
    this.bookmarkCount = bookmarkCount;
    this.updatedAt = updatedAt;
  }
}

export default Upload;
