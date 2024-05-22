import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Weather from ".";
import fetchMock from "jest-fetch-mock";

beforeEach(() => {
  fetchMock.resetMocks();
});

test("renders loading state initially and displays weather data", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({
      name: "Jakarta",
      sys: { country: "ID" },
      main: { temp: 30, humidity: 70 },
      wind: { speed: 5 },
      weather: [{ description: "clear sky" }],
    })
  );

  render(<Weather />);

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Jakarta/i)).toBeInTheDocument();
  });

  expect(screen.getByText(/Jakarta, ID/i)).toBeInTheDocument();
  expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
  expect(screen.getByText(/30/i)).toBeInTheDocument();
  expect(screen.getByText(/5/i)).toBeInTheDocument();
  expect(screen.getByText(/70%/i)).toBeInTheDocument();
});

test("fetches and displays weather data on search", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({
      name: "New York",
      sys: { country: "US" },
      main: { temp: 20, humidity: 60 },
      wind: { speed: 10 },
      weather: [{ description: "partly cloudy" }],
    })
  );

  render(<Weather />);

  const searchInput = screen.getByPlaceholderText("Enter City Name");
  const searchButton = screen.getByRole("button", { name: /search/i });

  userEvent.type(searchInput, "New York");
  userEvent.click(searchButton);

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
  });

  expect(screen.getByText(/New York, US/i)).toBeInTheDocument();
  expect(screen.getByText(/partly cloudy/i)).toBeInTheDocument();
  expect(screen.getByText(/20/i)).toBeInTheDocument();
  expect(screen.getByText(/10/i)).toBeInTheDocument();
  expect(screen.getByText(/60%/i)).toBeInTheDocument();
});
