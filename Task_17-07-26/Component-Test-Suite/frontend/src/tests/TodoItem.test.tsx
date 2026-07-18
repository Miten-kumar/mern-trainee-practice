import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import TodoItem from "../components/TodoItem";

describe("TodoItem", () => {
  const mockDelete = vi.fn();

  beforeEach(() => {
    mockDelete.mockClear();
  });

  test("renders todo text", () => {
    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    expect(
      screen.getByText("Learn React")
    ).toBeInTheDocument();
  });

  test("checkbox toggles", async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    const checkbox = screen.getByRole(
      "checkbox"
    ) as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    await user.click(checkbox);

    expect(checkbox.checked).toBe(true);
  });

  test("edit button opens input", async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    expect(
      screen.getByDisplayValue("Learn React")
    ).toBeInTheDocument();
  });

  test("save updates todo text", async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    const input = screen.getByDisplayValue(
      "Learn React"
    );

    await user.clear(input);

    await user.type(input, "Learn TypeScript");

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(
      screen.getByText("Learn TypeScript")
    ).toBeInTheDocument();
  });

  test("delete callback called", async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /delete/i,
      })
    );

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  test("edit button exists", () => {
    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /edit/i,
      })
    ).toBeInTheDocument();
  });

  test("delete button exists", () => {
    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /delete/i,
      })
    ).toBeInTheDocument();
  });

  test("save button appears in edit mode", async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    expect(
      screen.getByRole("button", {
        name: /save/i,
      })
    ).toBeInTheDocument();
  });

  test("supports multiple edits", async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        text="Learn React"
        onDelete={mockDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    let input = screen.getByDisplayValue(
      "Learn React"
    );

    await user.clear(input);
    await user.type(input, "First");

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    input = screen.getByDisplayValue("First");

    await user.clear(input);

    await user.type(input, "Second");

    await user.click(
      screen.getByRole("button", {
        name: /save/i,
      })
    );

    expect(
      screen.getByText("Second")
    ).toBeInTheDocument();
  });
});