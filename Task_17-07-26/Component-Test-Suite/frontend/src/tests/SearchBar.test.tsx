import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test("renders search input", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText("Search...")
    ).toBeInTheDocument();
  });

  test("allows typing", async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(
      "Search..."
    ) as HTMLInputElement;

    await user.type(input, "React");

    expect(input.value).toBe("React");
  });

  test("calls onSearch when Search button clicked", async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);

    await user.type(
      screen.getByPlaceholderText("Search..."),
      "Laptop"
    );

    await user.click(
      screen.getByRole("button", {
        name: /search/i,
      })
    );

    expect(mockOnSearch).toHaveBeenCalledWith("Laptop");
  });

  test("clears input", async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(
      "Search..."
    ) as HTMLInputElement;

    await user.type(input, "Phone");

    await user.click(
      screen.getByRole("button", {
        name: /clear/i,
      })
    );

    expect(input.value).toBe("");

    expect(mockOnSearch).toHaveBeenLastCalledWith("");
  });

  test("supports multiple searches", async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText("Search...");

    await user.type(input, "React");

    await user.click(
      screen.getByRole("button", {
        name: /search/i,
      })
    );

    await user.clear(input);

    await user.type(input, "Vue");

    await user.click(
      screen.getByRole("button", {
        name: /search/i,
      })
    );

    expect(mockOnSearch).toHaveBeenCalledTimes(2);
  });

  test("search button exists", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(
      screen.getByRole("button", {
        name: /search/i,
      })
    ).toBeInTheDocument();
  });

  test("clear button exists", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(
      screen.getByRole("button", {
        name: /clear/i,
      })
    ).toBeInTheDocument();
  });
});