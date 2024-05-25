import React from "react";
import { render, screen, fireEvent } from "@testing-library/react"; // Import tools untuk rendering dan simulasi event dalam komponen.
import Search from "../components/search"; // Import komponen Search yang akan diuji.

test("renders search input and button", () => {
  const mockSetSearch = jest.fn(); // Mock fungsi setSearch untuk memeriksa apakah dipanggil dengan benar.
  const mockHandleSearch = jest.fn(); // Mock fungsi handleSearch untuk memeriksa apakah dipanggil dengan benar.
  const searchValue = "Jakarta"; // Nilai awal untuk props search.

  render(
    <Search
      search={searchValue}
      setSearch={mockSetSearch}
      handleSearch={mockHandleSearch}
    />
  ); // Render komponen Search dengan props yang diberikan.

  const input = screen.getByPlaceholderText("Enter City Name"); // Cari elemen input berdasarkan placeholder.
  const button = screen.getByRole("button", { name: /search/i }); // Cari elemen button berdasarkan teks.

  expect(input).toBeInTheDocument(); // Pastikan elemen input ada dalam dokumen.
  expect(button).toBeInTheDocument(); // Pastikan elemen button ada dalam dokumen.
  expect(input).toHaveValue(searchValue); // Pastikan nilai input sesuai dengan nilai yang diberikan pada props.
});

test("calls setSearch on input change", () => {
  const mockSetSearch = jest.fn(); // Mock fungsi setSearch untuk memeriksa apakah dipanggil dengan benar.
  const mockHandleSearch = jest.fn(); // Mock fungsi handleSearch untuk memeriksa apakah dipanggil dengan benar.
  const searchValue = ""; // Nilai awal untuk props search.

  render(
    <Search
      search={searchValue}
      setSearch={mockSetSearch}
      handleSearch={mockHandleSearch}
    />
  ); // Render komponen Search dengan props yang diberikan.

  const input = screen.getByPlaceholderText("Enter City Name"); // Cari elemen input berdasarkan placeholder.

  fireEvent.change(input, { target: { value: "New York" } }); // Simulasi perubahan nilai pada input.
  expect(mockSetSearch).toHaveBeenCalledWith("New York"); // Pastikan fungsi setSearch dipanggil dengan nilai yang benar.
});

test("calls handleSearch on button click", () => {
  const mockSetSearch = jest.fn(); // Mock fungsi setSearch untuk memeriksa apakah dipanggil dengan benar.
  const mockHandleSearch = jest.fn(); // Mock fungsi handleSearch untuk memeriksa apakah dipanggil dengan benar.
  const searchValue = "Jakarta"; // Nilai awal untuk props search.

  render(
    <Search
      search={searchValue}
      setSearch={mockSetSearch}
      handleSearch={mockHandleSearch}
    />
  ); // Render komponen Search dengan props yang diberikan.

  const button = screen.getByRole("button", { name: /search/i }); // Cari elemen button berdasarkan teks.

  fireEvent.click(button); // Simulasi klik pada tombol.
  expect(mockHandleSearch).toHaveBeenCalled(); // Pastikan fungsi handleSearch dipanggil.
});
