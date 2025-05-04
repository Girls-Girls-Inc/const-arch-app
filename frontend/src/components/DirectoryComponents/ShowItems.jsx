import React from "react";

const ShowItems = ({ title, items }) => {
  return (
    <div className="w-100">
      <h4 className="text-center border-bottom">{title}</h4>
      <div className="directory-row">
        {items.map((item, index) => {
          return (
            <p
              key={index * 55}
              className="directory-item text-center border rounded-3 py-2"
            >
              <i className="material-symbols-outlined">folder</i>
              {item}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default ShowItems;
