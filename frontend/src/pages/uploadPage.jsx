import React from "react";
import Dropzone from "../components/DirectoryComponents/Dropzone";

const UploadPage = () => {
  return (
    <main>
      <h1>Upload Page</h1>
      <div className="upload-page">
        <Dropzone />
      </div>
    </main>
  );
};

export default UploadPage;
