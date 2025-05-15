import Directory from "../directory";

describe("Directory Model", () => {
  it("should correctly assign properties when instantiated", () => {
    const id = "1";
    const name = "Root Directory";
    const parentId = null; // Root directory has no parent
    const createdBy = "user123";
    const createdAt = new Date().toISOString();

    const directory = new Directory(id, name, parentId, createdBy, createdAt);

    expect(directory).toBeInstanceOf(Directory);
    expect(directory.id).toBe(id);
    expect(directory.name).toBe(name);
    expect(directory.parentId).toBe(parentId);
    expect(directory.createdBy).toBe(createdBy);
    expect(directory.createdAt).toBe(createdAt);
  });
});