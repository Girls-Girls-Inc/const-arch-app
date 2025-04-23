import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsPage from "../frontend/src/pages/settings";
import { UserProvider } from "../frontend/src/context/userContext";
import { BrowserRouter } from "../frontend/react-router-dom";

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
);

const mockUser = {
    uid: "12345",
    email: "test@example.com",
    displayName: "testuser",
    getIdToken: () => Promise.resolve("mock-token"),
};

const renderWithProviders = () => {
    return render(
        <UserProvider value={{ user: mockUser }}>
            <BrowserRouter>
                <SettingsPage />
            </BrowserRouter>
        </UserProvider>
    );
};

describe("SettingsPage", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test("renders input fields and save button", () => {
        renderWithProviders();

        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Current Password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
        expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });

    test("shows error toast when new password is set but current password is empty", async () => {
        renderWithProviders();

        fireEvent.change(screen.getByPlaceholderText("New Password"), {
            target: { value: "newpass123" },
        });

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Please enter your current password to set a new one.")).toBeInTheDocument();
        });
    });

    test("sends update request and shows success toast", async () => {
        renderWithProviders();

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "updatedUser" },
        });

        fireEvent.click(screen.getByText("Save Changes"));

        await waitFor(() => {
            expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledWith("http://localhost:4000/api/user/update-profile", expect.anything());
    });
});
