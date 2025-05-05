jest.mock("firebase/storage", () => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(() => Promise.resolve({ ref: {} })),
    getDownloadURL: jest.fn(() => Promise.resolve("https://example.com/file.pdf")),
}));

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
        currentUser: { email: "test@example.com" },
    })),
    GoogleAuthProvider: jest.fn(() => ({
        providerId: 'google.com',
    })),
    FacebookAuthProvider: jest.fn(() => ({
        providerId: 'facebook.com',
    })),
}));

jest.mock("firebase/firestore", () => ({
    serverTimestamp: jest.fn(() => new Date()),
    getFirestore: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(() => Promise.resolve({ ref: {} })),
    getDownloadURL: jest.fn(() => Promise.resolve("https://example.com/file.pdf")),
}));

jest.mock("axios", () => ({
    post: jest.fn(() => Promise.resolve({ status: 200, data: { success: true } })),
}));

jest.mock("react-hot-toast", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
        loading: jest.fn(() => "loading-toast-id"),
        dismiss: jest.fn(),
    },
}));

process.env.VITE_API_HOST_URL = 'https://mocked-api-url.com';

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUploadModal from "../DirectoryComponents/FileUploadModal";
import { toast } from "react-hot-toast";
import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

describe("FileUploadModal Component", () => {
    const handleCloseMock = jest.fn();
    const setUploadedFileMock = jest.fn();  // Add a mock for setUploadedFile

    const defaultProps = {
        showModal: true,
        handleClose: handleCloseMock,
        modalStep: 1,
        setModalStep: jest.fn(),
        uploadedFile: null,
        setUploadedFile: setUploadedFileMock,  // Pass the mock function here
    };

    test("renders modal and step 1 title", () => {
        render(<FileUploadModal {...defaultProps} />);
        expect(screen.getByText(/Upload Process/i)).toBeInTheDocument();
        expect(screen.getByText(/Upload File/i)).toBeInTheDocument();
    });

    test("allows user to add and remove tags", () => {
        render(
            <FileUploadModal
                {...defaultProps}
                modalStep={2}
                uploadedFile={{ file: new File(["test"], "test.pdf") }}
            />
        );

        const tagInput = screen.getByPlaceholderText(/Type and press Enter/i);
        fireEvent.change(tagInput, { target: { value: "policy" } });
        fireEvent.keyDown(tagInput, { key: "Enter", code: "Enter" });

        const policyTags = screen.getAllByText("policy");
        expect(policyTags.length).toBeGreaterThan(1);

        fireEvent.click(screen.getByText("×"));
        const policyTagsAfter = screen.getAllByText("policy");
        expect(policyTagsAfter.length).toBe(1);
    });

    test('calls handleUpload on Confirm button click', async () => {
        const uploadedFile = {
          file: new File(['content'], 'example.pdf', { type: 'application/pdf' }),
          customName: 'example.pdf',
        };

        render(
          <FileUploadModal
            {...defaultProps}
            modalStep={3}
            uploadedFile={uploadedFile}
          />
        );

        const confirmBtn = screen.getByRole('button', { name: /confirm/i });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
          expect(toast.success).toHaveBeenCalledWith('File uploaded successfully!', { duration: 2000 });
          expect(handleCloseMock).toHaveBeenCalled();
        });
    });
});
