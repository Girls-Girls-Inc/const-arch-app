import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUploadModal from "../DirectoryComponents/FileUploadModal";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

jest.mock("firebase/storage", () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytesResumable: jest.fn(),
    getDownloadURL: jest.fn(),
}));

jest.mock("axios");

describe("FileUploadModal", () => {
    const handleClose = jest.fn();
    const setModalStep = jest.fn();
    const setUploadedFile = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders upload modal when showModal is true", () => {
        render(
            <FileUploadModal
                showModal={true}
                handleClose={handleClose}
                modalStep={1}
                setModalStep={setModalStep}
                uploadedFile={null}
                setUploadedFile={setUploadedFile}
            />
        );

        expect(screen.getByText(/Upload File/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
    });

    test("clicking Next calls setModalStep with 2", () => {
        render(
            <FileUploadModal
                showModal={true}
                handleClose={handleClose}
                modalStep={1}
                setModalStep={setModalStep}
                uploadedFile={null}
                setUploadedFile={setUploadedFile}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /Next/i }));
        expect(setModalStep).toHaveBeenCalledWith(2);
    });

    test("clicking Back calls setModalStep with 1", () => {
        render(
            <FileUploadModal
                showModal={true}
                handleClose={handleClose}
                modalStep={2}
                setModalStep={setModalStep}
                uploadedFile={null}
                setUploadedFile={setUploadedFile}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /Back/i }));
        expect(setModalStep).toHaveBeenCalledWith(1);
    });

    test("uploading a file triggers handleUpload and sets uploadedFile", async () => {
        const file = new File(["file contents"], "testfile.txt", { type: "text/plain" });

        // Mock Firebase ref and uploadBytesResumable
        const mockUploadTask = {
            on: (event, progress, error, complete) => {
                // Immediately call complete callback to simulate successful upload
                complete();
            },
        };
        ref.mockReturnValue("mockRef");
        uploadBytesResumable.mockReturnValue(mockUploadTask);
        getDownloadURL.mockResolvedValue("https://fakeurl.com/testfile.txt");

        // Mock axios post response
        axios.post.mockResolvedValue({ data: { id: "12345" } });

        render(
            <FileUploadModal
                showModal={true}
                handleClose={handleClose}
                modalStep={1}
                setModalStep={setModalStep}
                uploadedFile={null}
                setUploadedFile={setUploadedFile}
            />
        );

        const input = screen.getByLabelText(/Select file/i) || screen.getByTestId("file-input") || screen.getByRole("textbox", { hidden: true });

        // fireEvent.change doesn’t always work well with file inputs, so we do:
        fireEvent.change(screen.getByLabelText(/Select file/i) || screen.getByTestId("file-input") || screen.getByRole("textbox", { hidden: true }), {
            target: { files: [file] },
        });

        // or alternative:
        // fireEvent.change(screen.getByTestId("file-input"), { target: { files: [file] } });

        // Wait for upload to complete
        await waitFor(() => expect(getDownloadURL).toHaveBeenCalled());

        expect(setUploadedFile).toHaveBeenCalledWith({
            id: "12345",
            name: "testfile.txt",
            type: "text/plain",
            size: file.size,
            url: "https://fakeurl.com/testfile.txt",
        });
    });

    test("clicking close resets state and calls handleClose", () => {
        render(
            <FileUploadModal
                showModal={true}
                handleClose={handleClose}
                modalStep={2}
                setModalStep={setModalStep}
                uploadedFile={{ name: "somefile.txt" }}
                setUploadedFile={setUploadedFile}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /Close/i }));

        expect(setModalStep).toHaveBeenCalledWith(1);
        expect(setUploadedFile).toHaveBeenCalledWith(null);
        expect(handleClose).toHaveBeenCalled();
    });
});
