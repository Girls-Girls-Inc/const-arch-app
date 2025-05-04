class Directory {
  constructor(id, name, parentId, createdBy, createdAt) {
    this.id = id;
    this.name = name;
    this.parentId = parentId; // Reference to another Directory
    this.createdBy = createdBy; // User ID
    this.createdAt = createdAt;
  }
}

export default Directory;