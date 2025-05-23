import React from "react";
import Dropzone from "../components/DirectoryComponents/Dropzone";

const UploadPage = () => {
  return (
    <main>
      <h1>Upload Page</h1>
      <section className="upload-page">
        <Dropzone />
      </section>
    </main>
  );
};

export default UploadPage;
