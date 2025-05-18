import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dropzone from "../DirectoryComponents/Dropzone";
import { act } from "react-dom/test-utils";

global.URL.createObjectURL = jest.fn(() => "mock-preview-url");
global.URL.revokeObjectURL = jest.fn();

describe("Dropzone Component", () => {
    let setUploadedFileMock;

    beforeEach(() => {
        setUploadedFileMock = jest.fn();

        URL.createObjectURL = jest.fn(() => "mock-preview-url");
        URL.revokeObjectURL = jest.fn();
    });

    test("renders dropzone and instructions", () => {
        render(<Dropzone setUploadedFile={setUploadedFileMock} uploadedFile={null} />);
        expect(screen.getByText(/Drag & drop a file here/i)).toBeInTheDocument();
        expect(screen.getByText(/Single file only/i)).toBeInTheDocument();
    });

    test("displays file info after drop", async () => {
        const setUploadedFileMock = jest.fn();

        render(<Dropzone setUploadedFile={setUploadedFileMock} uploadedFile={null} />);

        const input = screen.getByTestId("dropzone-input");

        const file = new File(["dummy content"], "example.pdf", { type: "application/pdf" });

        await act(async () => {
            fireEvent.change(input, {
                target: { files: [file] },
            });
        });

        expect(screen.getByText("example.pdf")).toBeInTheDocument();
    });


    test("allows file to be removed", async () => {
        const file = new File(["data"], "image.png", { type: "image/png" });
        const uploadedFile = { file };

        render(<Dropzone setUploadedFile={setUploadedFileMock} uploadedFile={uploadedFile} />);

        expect(screen.getByText("image.png")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /delete/i }));

        await waitFor(() => {
            expect(screen.queryByText("image.png")).not.toBeInTheDocument();
        });
    });

    test("revokes object URL on unmount", () => {
        const file = new File(["dummy content"], "test.png", { type: "image/png" });

        const { unmount } = render(
            <Dropzone setUploadedFile={setUploadedFileMock} uploadedFile={null} />
        );

        const input = screen.getByTestId("dropzone-input");

        act(() => {
            fireEvent.change(input, {
                target: { files: [file] },
            });
        });

        unmount(); 
        expect(URL.revokeObjectURL).toHaveBeenCalledWith("mock-preview-url");
    });

});
