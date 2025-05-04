class Upload {
    constructor(id, fileName, filePath, directoryId, uploadedBy, metadataId, fileType, tags, uploadDate, visibility, bookmarkCount, updatedAt) {
        this.id = id;
        this.fileName = fileName;
        this.filePath = filePath;
        this.directoryId = directoryId;
        this.uploadedBy = uploadedBy;
        this.metadataId = metadataId;
        this.fileType = fileType;
        this.tags = tags; // Array of strings
        this.uploadDate = uploadDate;
        this.visibility = visibility; // "public" or "private"
        this.bookmarkCount = bookmarkCount;
        this.updatedAt = updatedAt;
    }
}

export default Upload;