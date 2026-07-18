import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import UserList from "../components/UserList";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  getUsers: vi.fn(),
}));

describe("UserList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows loading initially", () => {
    vi.mocked(api.getUsers).mockImplementation(
      () =>
        new Promise(() => {
          // Keep promise pending
        })
    );

    render(<UserList />);

    expect(
      screen.getByText(/loading/i)
    ).toBeInTheDocument();
  });

  test("renders users after successful API call", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: "John Doe",
      },
      {
        id: 2,
        name: "Jane Smith",
      },
    ]);

    render(<UserList />);

    expect(
      await screen.findByText("John Doe")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Jane Smith")
    ).toBeInTheDocument();
  });

  test("calls getUsers once", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: "John",
      },
    ]);

    render(<UserList />);

    await screen.findByText("John");

    expect(api.getUsers).toHaveBeenCalledTimes(1);
  });

  test("shows empty state when API returns no users", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([]);

    render(<UserList />);

    expect(
      await screen.findByText(/no users found/i)
    ).toBeInTheDocument();
  });

  test("shows error message when API fails", async () => {
    vi.mocked(api.getUsers).mockRejectedValue(
      new Error("Network Error")
    );

    render(<UserList />);

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });

  test("does not show loading after success", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: "Alice",
      },
    ]);

    render(<UserList />);

    await screen.findByText("Alice");

    expect(
      screen.queryByText(/loading/i)
    ).not.toBeInTheDocument();
  });

  test("does not show loading after error", async () => {
    vi.mocked(api.getUsers).mockRejectedValue(
      new Error("Server Error")
    );

    render(<UserList />);

    await screen.findByText(/something went wrong/i);

    expect(
      screen.queryByText(/loading/i)
    ).not.toBeInTheDocument();
  });

  test("renders multiple users", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
      { id: 3, name: "User 3" },
      { id: 4, name: "User 4" },
    ]);

    render(<UserList />);

    expect(
      await screen.findByText("User 1")
    ).toBeInTheDocument();

    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("User 3")).toBeInTheDocument();
    expect(screen.getByText("User 4")).toBeInTheDocument();
  });

  test("renders user list items", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: "React User",
      },
    ]);

    render(<UserList />);

    await screen.findByText("React User");

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(1);
  });

  test("handles long user names", async () => {
    const longName =
      "Alexander Jonathan Christopher Williams Johnson";

    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: longName,
      },
    ]);

    render(<UserList />);

    expect(
      await screen.findByText(longName)
    ).toBeInTheDocument();
  });

  test("handles special characters in names", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: "@John_2026!",
      },
    ]);

    render(<UserList />);

    expect(
      await screen.findByText("@John_2026!")
    ).toBeInTheDocument();
  });

  test("renders unordered list after successful fetch", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: "John",
      },
    ]);

    render(<UserList />);

    await screen.findByText("John");

    expect(
      screen.getByRole("list")
    ).toBeInTheDocument();
  });

  test("waits for async rendering", async () => {
    vi.mocked(api.getUsers).mockResolvedValue([
      {
        id: 1,
        name: "Delayed User",
      },
    ]);

    render(<UserList />);

    await waitFor(() => {
      expect(
        screen.getByText("Delayed User")
      ).toBeInTheDocument();
    });
  });
});