import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "../src/App";

vi.mock("../src/api/api", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        success: true,
        status: "ok",
        environment: "test",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
    }),
  },
}));

describe("App", () => {
  it("should render the application title", () => {
    render(<App />);

    expect(
      screen.getByText("Complete CI/CD Pipeline")
    ).toBeInTheDocument();
  });

  it("should display backend connection information", async () => {
    render(<App />);

    expect(
      await screen.findByText("Backend Connection")
    ).toBeInTheDocument();
  });
});