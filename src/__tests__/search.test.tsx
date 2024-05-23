import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Search from "../components/search";

test("renders search input and button", () => {
  const mockSetSearch = jest.fn();
  const mockHandleSearch = jest.fn();
  const searchValue = "Jakarta";

  render(
    <Search
      search={searchValue}
      setSearch={mockSetSearch}
      handleSearch={mockHandleSearch}
    />
  );

  const input = screen.getByPlaceholderText("Enter City Name");
  const button = screen.getByRole("button", { name: /search/i });

  expect(input).toBeInTheDocument();
  expect(button).toBeInTheDocument();
  expect(input).toHaveValue(searchValue);
});

test("calls setSearch on input change", () => {
  const mockSetSearch = jest.fn();
  const mockHandleSearch = jest.fn();
  const searchValue = "";

  render(
    <Search
      search={searchValue}
      setSearch={mockSetSearch}
      handleSearch={mockHandleSearch}
    />
  );

  const input = screen.getByPlaceholderText("Enter City Name");

  fireEvent.change(input, { target: { value: "New York" } });
  expect(mockSetSearch).toHaveBeenCalledWith("New York");
});

test("calls handleSearch on button click", () => {
  const mockSetSearch = jest.fn();
  const mockHandleSearch = jest.fn();
  const searchValue = "Jakarta";

  render(
    <Search
      search={searchValue}
      setSearch={mockSetSearch}
      handleSearch={mockHandleSearch}
    />
  );

  const button = screen.getByRole("button", { name: /search/i });

  fireEvent.click(button);
  expect(mockHandleSearch).toHaveBeenCalled();
});
