import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../Styles/dropzone.css"; // Make sure the path is correct based on your folder structure

const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <form className="dropzone-form">
      <div
        {...getRootProps()}
        className={`dropzone-container ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drop some files here or click to select</p>
        )}
      </div>
    </form>
  );
};

export default Dropzone;
