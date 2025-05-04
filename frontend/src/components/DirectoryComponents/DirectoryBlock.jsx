import React from "react";
import ShowItems from "./ShowItems";

const folders = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item6"];
const files = ["File 1", "File 2", "File 3", "File 4", "File 5"];

const DirectoryBlock = () => {
  return (
    <div className="col-md-12 w-100">
      <ShowItems title={"Created folders"} items={folders} />
      <ShowItems title={"Created files"} items={files} />
    </div>
  );
};

export default DirectoryBlock;
