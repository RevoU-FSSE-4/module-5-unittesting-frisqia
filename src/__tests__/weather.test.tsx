import { act, render, screen } from "@testing-library/react";
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

    expect(await screen.findByText(/Jakarta, ID/i)).toBeInTheDocument();
    expect(await screen.findByText(/scattered clouds/i)).toBeInTheDocument();
    expect(await screen.findByText("301.96")).toBeInTheDocument();
    expect(await screen.findByText("2.57")).toBeInTheDocument();
    expect(await screen.findByText("79%")).toBeInTheDocument();
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

    expect(await screen.findByText(/New York, US/i)).toBeInTheDocument();
    expect(await screen.findByText(/clear sky/i)).toBeInTheDocument();
    expect(await screen.findByText("295.37")).toBeInTheDocument();
    expect(await screen.findByText("3.1")).toBeInTheDocument();
    expect(await screen.findByText("50%")).toBeInTheDocument();
  });
});
