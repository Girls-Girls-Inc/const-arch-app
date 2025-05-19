import React from "react";
import { render, screen } from "@testing-library/react";
import ShowItems from "../DirectoryComponents/ShowItems";

describe("ShowItems Component", () => {
  const title = "My Folders";
  const items = ["Documents", "Photos", "Videos"];

  beforeEach(() => {
    render(<ShowItems title={title} items={items} />);
  });

  it("renders the title correctly", () => {
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders all folder items", () => {
    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders a folder icon for each item", () => {
    const icons = screen.getAllByText("folder");
    expect(icons.length).toBe(items.length);
  });
});
