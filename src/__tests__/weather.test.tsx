import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Weather from "../components/weather";

global.fetch = jest.fn();

describe("Weather Component", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("displays loading state initially", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "Jakarta",
        sys: { country: "ID" },
        main: { temp: 301.96, humidity: 79 },
        wind: { speed: 2.57 },
        weather: [{ description: "scattered clouds" }],
      }),
    });

    render(<Weather />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays weather data after fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "Jakarta",
        sys: { country: "ID" },
        main: { temp: 301.96, humidity: 79 },
        wind: { speed: 2.57 },
        weather: [{ description: "scattered clouds" }],
      }),
    });

    render(<Weather />);

    expect(
      await screen.findByRole("heading", { name: /Jakarta, ID/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/scattered clouds/i)).toBeInTheDocument();
    expect(screen.getByText("301.96")).toBeInTheDocument();
    expect(screen.getByText("2.57")).toBeInTheDocument();
    expect(screen.getByText("79%")).toBeInTheDocument();
  });

  test("fetches and displays weather data on search", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "New York",
        sys: { country: "US" },
        main: { temp: 295.37, humidity: 50 },
        wind: { speed: 3.1 },
        weather: [{ description: "clear sky" }],
      }),
    });

    render(<Weather />);

    const input = screen.getByPlaceholderText("Enter City Name");
    const button = screen.getByRole("button", { name: /search/i });

    userEvent.type(input, "New York");
    userEvent.click(button);

    expect(
      await screen.findByRole("heading", { name: /New York, US/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    expect(screen.getByText("295.37")).toBeInTheDocument();
    expect(screen.getByText("3.1")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  test("logs an error message to console and displays an error message on screen when fetch fails", async () => {
    const mockError = new Error("data Not Found");
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Weather />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
