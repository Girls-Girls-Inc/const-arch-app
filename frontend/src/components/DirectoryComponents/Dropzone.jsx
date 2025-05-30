import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "../Styles/dropzone.css";

const Dropzone = ({ setUploadedFile, uploadedFile }) => {
  const [file, setFile] = useState(uploadedFile?.file || null);

  useEffect(() => {
    return () => {
      if (file?.preview) URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0];
        setFile({
          file: newFile,
          name: newFile.name,
          type: newFile.type,
          size: newFile.size,
          isImage: newFile.type.startsWith("image/"),
        });

        setUploadedFile({
          file: newFile,
          customName: newFile.name,
        });
      }
    },
    [setUploadedFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
      "application/*": [".pdf", ".doc", ".docx", ".txt"],
    },
  });

  const removeFile = () => setFile(null);

  return (
    <div className="dropzone-form container mt-4">
      <div
        {...getRootProps()}
        className={`dropzone-container ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="dropzone-content">
            <i className="material-symbols-outlined fs-1">drag_pan</i>
            <p className="mt-2">Drop your file here...</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <i className="material-symbols-outlined fs-1">upload</i>
            <p className="mt-2">Drag & drop a file here, or click to select</p>
            <small className="text-muted">(Single file only)</small>
          </div>
        )}
      </div>

      {file && (
        <div className="shadow-sm mt-3 d-flex align-items-center justify-content-between p-3 bg-light rounded">
          <div className="d-flex align-items-center">
            <i
              className={`material-symbols-outlined me-3 fs-2 ${
                file.isImage ? "text-primary" : "text-secondary"
              }`}
            >
              {file.isImage ? "image" : "description"}
            </i>
            <div>
              <div className="text-dark fw-medium">{file.name}</div>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="btn btn-sm btn-outline-danger"
          >
            <i className="material-symbols-outlined">delete</i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
