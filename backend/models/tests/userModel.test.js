import User from "../user";

describe("User model", () => {
  it("should correctly assign properties when instantiated", () => {
    const mockData = {
      id: "123",
      name: "Jane Doe",
      email: "jane@example.com",
      role: true,
      photoURL: "https://example.com/photo.jpg",
      signUpDate: "2025-05-03",
      profileComplete: true,
    };

    const user = new User(
      mockData.id,
      mockData.name,
      mockData.email,
      mockData.role,
      mockData.photoURL,
      mockData.signUpDate,
      mockData.profileComplete
    );

    expect(user.id).toBe(mockData.id);
    expect(user.name).toBe(mockData.name);
    expect(user.email).toBe(mockData.email);
    expect(user.isAdmin).toBe(mockData.role);
    expect(user.photoURL).toBe(mockData.photoURL);
    expect(user.signUpDate).toBe(mockData.signUpDate);
    expect(user.profileComplete).toBe(mockData.profileComplete);
  });
});