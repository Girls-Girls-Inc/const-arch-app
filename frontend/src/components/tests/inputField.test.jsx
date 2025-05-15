import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, getByRole, getByText } from "@testing-library/react";
import InputField from "../InputField";

describe('Input Field', () => {
    it('should render input with correct props and call onChange function', () => {
        handleChange = jest.fn();

        render(
            <InputField
                id="test-input"
                type="text"
                onChange={handleChange}
                placeholder="Enter test value"
                value="test value"
                icon="edit"
            />
        );

        const input = screen.getByPlaceholderText("Enter test value");
        const icon = screen.getByText("edit");

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("id", "test-input");
        expect(input).toHaveAttribute("type", "text");
        expect(input).toHaveValue("test value");
        expect(input).toBeRequired();
        expect(input).toHaveClass("input-field");

        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass("material-symbols-outlined");

        fireEvent.change(input, { target: { value: "new value" } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('should not be required if required prop set to false', () => {
        render(
            <InputField
                id="test-input"
                type="text"
                placeholder="Enter not required test value"
                required={false}
            />
        );

        const notRequiredInput = screen.getByPlaceholderText("Enter not required test value");

        expect(notRequiredInput).toBeInTheDocument();
        expect(notRequiredInput).not.toBeRequired();
    })
})