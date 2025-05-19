jest.mock("../../Firebase/firebase", () => ({
    auth: {
        currentUser: { email: "testuser@example.com" },
    },
    db: {},
}));

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    Timestamp: { now: () => "mocked-timestamp" },
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
    setDoc: jest.fn(() => Promise.resolve()),
    doc: jest.fn(() => "mock-folder-ref"),
}));

jest.mock("react-hot-toast", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("../IconButton", () => (props) => (
    <button
        onClick={props.onClick}
        type="button"
        data-testid={`icon-button-${props.label.toLowerCase()}`}
    >
        {props.label}
    </button>
));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateFolderModal from "../DirectoryComponents/CreateFolderModal";
import { toast } from "react-hot-toast";
import { getDocs, setDoc } from "firebase/firestore";

describe("CreateFolderModal", () => {
    const defaultProps = {
        showModal: true,
        handleClose: jest.fn(),
        currentFolderId: null,
        onFolderCreated: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(globalThis, "crypto", {
            value: {
                ...globalThis.crypto,
                randomUUID: () => "mocked-uuid",
            },
        });
    });

    it("renders the modal and inputs", () => {
        render(<CreateFolderModal {...defaultProps} />);
        expect(screen.getByPlaceholderText("Enter folder name")).toBeInTheDocument();
        expect(screen.getByText("Create")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("shows error if folder name is empty", () => {
        render(<CreateFolderModal {...defaultProps} />);
        fireEvent.click(screen.getByText("Create"));
        expect(toast.error).toHaveBeenCalledWith("Folder name cannot be empty.");
    });

    it("calls handleCreateFolder and Firestore when valid", async () => {
        render(<CreateFolderModal {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText("Enter folder name"), {
            target: { value: "Test Folder" },
        });

        fireEvent.click(screen.getByTestId("icon-button-create"));

        await waitFor(() => {
            expect(setDoc).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("Folder created!");
            expect(defaultProps.handleClose).toHaveBeenCalled();
            expect(defaultProps.onFolderCreated).toHaveBeenCalled();
        });
    });


    it("calls handleClose on cancel", () => {
        render(<CreateFolderModal {...defaultProps} />);
        fireEvent.click(screen.getByText("Cancel"));
        expect(defaultProps.handleClose).toHaveBeenCalled();
    });
});
