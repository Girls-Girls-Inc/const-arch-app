import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditUploadDetails from "../pages/editDetails";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { getDoc, updateDoc } from "firebase/firestore";

// Mock Firebase and other dependencies
const mockDocRef = { id: "mock-doc-id" };

jest.mock("../Firebase/firebase", () => ({
    db: {}, // You can mock db if needed
}));

jest.mock("firebase/firestore", () => ({
    doc: jest.fn(() => mockDocRef),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    getFirestore: jest.fn(),
    Timestamp: {
        now: jest.fn(() => new Date("2023-01-01")),
    },
}));

jest.mock("react-hot-toast", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    Toaster: () => <div data-testid="toaster" />,
}));

jest.mock("../components/NavigationComponent", () => () => <div data-testid="nav-component" />);
jest.mock("../components/NavigationDashLeft", () => () => <div data-testid="nav-left" />);
jest.mock("../components/InputField", () => ({ id, label, value, onChange }) => (
    <input
        data-testid={id}
        value={value}
        onChange={onChange}
        placeholder={label}
    />
));
jest.mock("../components/IconButton", () => ({ label, ...props }) => (
    <button {...props}>{label}</button>
));

describe("EditUploadDetails", () => {
    const mockData = {
        fileName: "Test Document",
        fileType: "pdf",
        uploadedBy: "user@example.com",
        uploadDate: "2023-01-01",
        bookmarkCount: 3,
        directoryId: "dir123",
        visibility: "private",
        tags: ["tag1", "tag2"],
        updatedAt: {
            toDate: () => new Date("2023-01-01"),
        },
    };

    beforeEach(() => {
        require("firebase/firestore").getDoc.mockResolvedValue({
            exists: () => true,
            data: () => mockData,
        });
        updateDoc.mockResolvedValue();
    });

    it("renders loading spinner initially", async () => {
        render(
            <MemoryRouter initialEntries={["/editUploadDetails/123"]}>
                <Routes>
                    <Route path="/editUploadDetails/:id" element={<EditUploadDetails />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByRole("status")).toBeInTheDocument();
        await waitFor(() => expect(getDoc).toHaveBeenCalled());
    });

    it("renders form with fetched values", async () => {
        render(
            <MemoryRouter initialEntries={["/editUploadDetails/123"]}>
                <Routes>
                    <Route path="/editUploadDetails/:id" element={<EditUploadDetails />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByPlaceholderText("File Name").value).toBe("Test Document");
            expect(screen.getByPlaceholderText("File Type").value).toBe("pdf");
            expect(screen.getByPlaceholderText("Uploaded By").value).toBe("user@example.com");
        });
    });

    it("updates upload on submit", async () => {
        render(
            <MemoryRouter initialEntries={["/editUploadDetails/123"]}>
                <Routes>
                    <Route path="/editUploadDetails/:id" element={<EditUploadDetails />} />
                </Routes>
            </MemoryRouter>
        );

        await screen.findByText("Edit Upload Details");

        const fileNameInput = screen.getByPlaceholderText("File Name");
        fireEvent.change(fileNameInput, { target: { value: "Updated Name" } });

        const saveButton = screen.getByText("Save Changes");
        fireEvent.click(saveButton);

        await waitFor(() =>
            expect(updateDoc).toHaveBeenCalledWith(
                mockDocRef,
                expect.objectContaining({
                    fileName: "Updated Name",
                })
            )
        );
    });
});
