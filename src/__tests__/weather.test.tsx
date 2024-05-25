import React from "react";
import { render, screen, waitFor } from "@testing-library/react"; // Import tools untuk rendering dan simulasi event dalam komponen.
import "@testing-library/jest-dom"; // Import ekstensi matcher untuk Jest, untuk assertion yang lebih mudah dibaca.
import userEvent from "@testing-library/user-event"; // Import library untuk mensimulasikan event pengguna.
import Weather from "../components/weather"; // Import komponen Weather yang akan diuji.

global.fetch = jest.fn(); // Membuat mock global untuk fungsi fetch, agar tidak melakukan request HTTP nyata selama pengujian.

describe("Weather Component", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset semua mock sebelum setiap pengujian, memastikan tidak ada state yang terbawa dari tes sebelumnya.
  });

  test("displays loading state initially", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      // Mengatur mock fetch untuk memberikan response yang diinginkan.
      ok: true,
      json: async () => ({
        name: "Jakarta",
        sys: { country: "ID" },
        main: { temp: 301.96, humidity: 79 },
        wind: { speed: 2.57 },
        weather: [{ description: "scattered clouds" }],
      }),
    });

    render(<Weather />); // Render komponen Weather.

    expect(screen.getByText("Loading...")).toBeInTheDocument(); // Pastikan teks "Loading..." muncul di layar.
  });

  test("displays weather data after fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      // Mengatur mock fetch untuk memberikan response yang diinginkan.
      ok: true,
      json: async () => ({
        name: "Jakarta",
        sys: { country: "ID" },
        main: { temp: 301.96, humidity: 79 },
        wind: { speed: 2.57 },
        weather: [{ description: "scattered clouds" }],
      }),
    });

    render(<Weather />); // Render komponen Weather.

    expect(
      await screen.findByRole("heading", { name: /Jakarta, ID/i })
    ).toBeInTheDocument(); // Pastikan elemen heading dengan teks "Jakarta, ID" muncul di layar.
    expect(screen.getByText(/scattered clouds/i)).toBeInTheDocument(); // Pastikan deskripsi cuaca muncul di layar.
    expect(screen.getByText("301.96")).toBeInTheDocument(); // Pastikan suhu muncul di layar.
    expect(screen.getByText("2.57")).toBeInTheDocument(); // Pastikan kecepatan angin muncul di layar.
    expect(screen.getByText("79%")).toBeInTheDocument(); // Pastikan kelembapan muncul di layar.
  });

  test("fetches and displays weather data on search", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      // Mengatur mock fetch untuk memberikan response yang diinginkan.
      ok: true,
      json: async () => ({
        name: "New York",
        sys: { country: "US" },
        main: { temp: 295.37, humidity: 50 },
        wind: { speed: 3.1 },
        weather: [{ description: "clear sky" }],
      }),
    });

    render(<Weather />); // Render komponen Weather.

    const input = screen.getByPlaceholderText("Enter City Name"); // Cari elemen input berdasarkan placeholder.
    const button = screen.getByRole("button", { name: /search/i }); // Cari elemen button berdasarkan teks.

    userEvent.type(input, "New York"); // Simulasikan pengetikan "New York" pada input.
    userEvent.click(button); // Simulasikan klik pada tombol search.

    expect(
      await screen.findByRole("heading", { name: /New York, US/i })
    ).toBeInTheDocument(); // Pastikan elemen heading dengan teks "New York, US" muncul di layar.
    expect(screen.getByText("clear sky")).toBeInTheDocument(); // Pastikan deskripsi cuaca muncul di layar.
    expect(screen.getByText("295.37")).toBeInTheDocument(); // Pastikan suhu muncul di layar.
    expect(screen.getByText("3.1")).toBeInTheDocument(); // Pastikan kecepatan angin muncul di layar.
    expect(screen.getByText("50%")).toBeInTheDocument(); // Pastikan kelembapan muncul di layar.
  });

  test("logs an error message to console and displays an error message on screen when fetch fails", async () => {
    const mockError = new Error("data Not Found"); // Buat error mock untuk simulasi kegagalan fetch.
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError); // Mengatur mock fetch untuk memberikan error.

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {}); // Spy dan mock implementasi console.error untuk memeriksa apakah dipanggil.

    render(<Weather />); // Render komponen Weather.

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument(); // Pastikan teks "Loading..." tidak ada di layar setelah fetch gagal.
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError); // Pastikan console.error dipanggil dengan error yang benar.
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1); // Pastikan console.error dipanggil sekali.

    consoleErrorSpy.mockRestore(); // Kembalikan implementasi asli console.error.
  });
});
