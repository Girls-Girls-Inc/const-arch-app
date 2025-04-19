import React from "react";
import NavigationComponent from "../components/NavigationComponent";
import IconButton from "../components/IconButton";

const Directory = () => {
  return (
    <main>
      <NavigationComponent PageName="Directory" />
      <div className="directory-page">
        <div className="upload-buttons">
          <IconButton route="/upload" icon="upload_file" label="Upload File" />
          <IconButton
            route="/upload"
            icon="create_new_folder"
            label="Create Folder"
          />
        </div>
      </div>
    </main>
  );
};

export default Directory;
