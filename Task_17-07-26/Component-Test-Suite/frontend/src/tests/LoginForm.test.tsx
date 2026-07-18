import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import LoginForm from "../components/LoginForm";

describe("LoginForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test("renders email input", () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  test("renders password input", () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("renders login button", () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });

  test("shows required validation", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(
      screen.getByText("Email is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Password is required")
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows invalid email error", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(
      screen.getByPlaceholderText("Email"),
      "abc"
    );

    await user.type(
      screen.getByPlaceholderText("Password"),
      "123456"
    );

    await user.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(
      screen.getByText("Invalid email")
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows minimum password error", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(
      screen.getByPlaceholderText("Email"),
      "admin@test.com"
    );

    await user.type(
      screen.getByPlaceholderText("Password"),
      "123"
    );

    await user.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(
      screen.getByText("Minimum 6 characters")
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("submits valid form", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(
      screen.getByPlaceholderText("Email"),
      "admin@test.com"
    );

    await user.type(
      screen.getByPlaceholderText("Password"),
      "123456"
    );

    await user.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      "admin@test.com",
      "123456"
    );
  });

  test("allows typing in inputs", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByPlaceholderText(
      "Email"
    ) as HTMLInputElement;

    const passwordInput = screen.getByPlaceholderText(
      "Password"
    ) as HTMLInputElement;

    await user.type(emailInput, "user@gmail.com");
    await user.type(passwordInput, "abcdef");

    expect(emailInput.value).toBe("user@gmail.com");
    expect(passwordInput.value).toBe("abcdef");
  });

  test("does not submit invalid email", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(
      screen.getByPlaceholderText("Email"),
      "wrong-email"
    );

    await user.type(
      screen.getByPlaceholderText("Password"),
      "123456"
    );

    await user.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("shows required error for spaces only", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(
      screen.getByPlaceholderText("Email"),
      "     "
    );

    await user.type(
      screen.getByPlaceholderText("Password"),
      "123456"
    );

    await user.click(
      screen.getByRole("button", { name: /login/i })
    );

    expect(
      screen.getByText("Email is required")
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("submits multiple times", async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const button = screen.getByRole("button", {
      name: /login/i,
    });

    await user.type(email, "admin@test.com");
    await user.type(password, "123456");

    await user.click(button);
    await user.click(button);

    expect(mockOnSubmit).toHaveBeenCalledTimes(2);
  });
});