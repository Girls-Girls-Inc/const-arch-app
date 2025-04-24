import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserProvider } from "../context/userContext.jsx";
import SettingsPage from "../pages/settings.jsx";
import { BrowserRouter } from "react-router-dom";

// Your test case assumes Firebase is properly initialized and working
describe("SettingsPage", () => {
    test("renders input fields and save button", async () => {
        render(
            <UserProvider>
                <BrowserRouter>
                    <SettingsPage />
                </BrowserRouter>
            </UserProvider>
        );

        // Ensure all fields and buttons are rendered
        expect(screen.getByPlaceholderText("Enter Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter current password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter new password")).toBeInTheDocument();
        expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });

    test("shows error toast when new password is set but current password is empty", async () => {
        render(
            <UserProvider>
                <BrowserRouter>
                    <SettingsPage />
                </BrowserRouter>
            </UserProvider>
        );

        // Fill in the new password field without current password
        fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
            target: { value: "newpassword123" },
        });

        // Click on save changes
        fireEvent.click(screen.getByText("Save Changes"));

        // Wait for the toast message to appear
        await waitFor(() => {
            expect(screen.getByText("Please enter your current password to set a new one.")).toBeInTheDocument();
        });
    });

    test("sends update request and shows success toast", async () => {
        render(
            <UserProvider>
                <BrowserRouter>
                    <SettingsPage />
                </BrowserRouter>
            </UserProvider>
        );

        // Simulate filling out the form
        fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
            target: { value: "updatedUser" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter email"), {
            target: { value: "updatedemail@example.com" },
        });

        // Submit the form
        fireEvent.click(screen.getByText("Save Changes"));

        // Wait for the success toast
        await waitFor(() => {
            expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument();
        });
    });

    test("redirects user to sign-in page if not authenticated", async () => {
        // Initialize Firebase with no user signed in (or mock Firebase to simulate this state)
        render(
            <UserProvider>
                <BrowserRouter>
                    <SettingsPage />
                </BrowserRouter>
            </UserProvider>
        );

        // Wait for the redirect to occur
        await waitFor(() => {
            // Assume you have logic that checks for `user` and redirects
            expect(window.location.pathname).toBe("/signIn");
        });
    });
});