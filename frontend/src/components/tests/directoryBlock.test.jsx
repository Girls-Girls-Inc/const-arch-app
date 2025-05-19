import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DirectoryBlock from "../DirectoryComponents/DirectoryBlock";
import { getDocs } from "firebase/firestore";
import toast from "react-hot-toast";

jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
}));

jest.mock("../../Firebase/firebase", () => ({
    auth: {
        currentUser: { email: "testuser@example.com" },
    },
    db: {},
}));

jest.mock("react-hot-toast", () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
        error: jest.fn(),
        loading: jest.fn(() => "loading-id"),
        dismiss: jest.fn(),
    },
}));

jest.mock("../IconButton", () => (props) => (
    <button
        onClick={props.onClick}
        disabled={props.disabled}
        data-testid={`icon-button-${props.label?.toLowerCase() || props.icon}`}
    >
        {props.label || props.icon}
    </button>
));

describe("DirectoryBlock", () => {
    const mockSetCurrentFolderId = jest.fn();
    const mockSetBreadcrumb = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        const folderDoc = {
            id: "folder1",
            data: () => ({
                name: "My Folder",
                parentId: null,
                createdBy: "testuser@example.com",
            }),
        };

        const fileDoc = {
            id: "file1",
            data: () => ({
                fileName: "My File",
                filePath: "/path/to/file",
                uploadedBy: "testuser@example.com",
                directoryId: "default_directory",
            }),
        };

        getDocs
            .mockResolvedValueOnce({ docs: [folderDoc] })
            .mockResolvedValueOnce({ docs: [fileDoc] });
    });

    it("renders without crashing and shows folders/files", async () => {
        render(
            <DirectoryBlock
                currentFolderId={null}
                setCurrentFolderId={mockSetCurrentFolderId}
                breadcrumb={[]}
                setBreadcrumb={mockSetBreadcrumb}
            />
        );

        expect(screen.getByTestId("icon-button-back")).toBeInTheDocument();
        expect(screen.getByTestId("icon-button-refresh")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("My Folder")).toBeInTheDocument();
            expect(screen.getByText("My File")).toBeInTheDocument();
        });
    });

    it("calls setCurrentFolderId and setBreadcrumb on folder click", async () => {
        render(
            <DirectoryBlock
                currentFolderId={null}
                setCurrentFolderId={mockSetCurrentFolderId}
                breadcrumb={[]}
                setBreadcrumb={mockSetBreadcrumb}
            />
        );

        await waitFor(() => screen.getByText("My Folder"));
        fireEvent.click(screen.getByText("My Folder"));

        expect(mockSetCurrentFolderId).toHaveBeenCalledWith("folder1");
        expect(mockSetBreadcrumb).toHaveBeenCalled();

        const setBreadcrumbArg = mockSetBreadcrumb.mock.calls[0][0];
        expect(typeof setBreadcrumbArg).toBe("function");
        const result = setBreadcrumbArg([]);
        expect(result).toEqual([{ id: "folder1", name: "My Folder" }]);
    });


    it("goes back in breadcrumb", async () => {
        const breadcrumb = [{ id: "folder1", name: "My Folder" }];

        render(
            <DirectoryBlock
                currentFolderId="folder1"
                setCurrentFolderId={mockSetCurrentFolderId}
                breadcrumb={breadcrumb}
                setBreadcrumb={mockSetBreadcrumb}
            />
        );

        fireEvent.click(screen.getByTestId("icon-button-back"));

        expect(mockSetBreadcrumb).toHaveBeenCalled();
        expect(mockSetCurrentFolderId).toHaveBeenCalled();
    });

    it("refreshes directory on refresh click", async () => {
        getDocs
            .mockResolvedValueOnce({
                docs: [
                    {
                        id: "folder1",
                        data: () => ({
                            name: "My Folder",
                            parentId: null,
                            createdBy: "testuser@example.com",
                        }),
                    },
                ],
            })
            .mockResolvedValueOnce({
                docs: [
                    {
                        id: "file1",
                        data: () => ({
                            fileName: "My File",
                            filePath: "/path/to/file",
                            uploadedBy: "testuser@example.com",
                            directoryId: "default_directory",
                        }),
                    },
                ],
            });

        render(
            <DirectoryBlock
                currentFolderId={null}
                setCurrentFolderId={mockSetCurrentFolderId}
                breadcrumb={[]}
                setBreadcrumb={mockSetBreadcrumb}
            />
        );

        fireEvent.click(screen.getByTestId("icon-button-refresh"));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Directory refreshed!");
        });
    });


    it("shows error toast if Firestore fails", async () => {
        getDocs.mockRejectedValueOnce(new Error("Firestore error")).mockRejectedValueOnce(new Error("Firestore error"));

        render(
            <DirectoryBlock
                currentFolderId={null}
                setCurrentFolderId={mockSetCurrentFolderId}
                breadcrumb={[]}
                setBreadcrumb={mockSetBreadcrumb}
            />
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to load directory.");
        });
    });
});
