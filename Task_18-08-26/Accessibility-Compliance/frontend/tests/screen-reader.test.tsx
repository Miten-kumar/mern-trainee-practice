import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import AccessibleDashboard from "../src/components/accessibleDashboard";

vi.mock("../src/api/accessibilityApi", () => ({
  getAccessibilityPreferences: vi.fn().mockResolvedValue({
    highContrast: false,
    reducedMotion: false,
    screenReaderAnnouncements: true,
  }),

  updateAccessibilityPreferences: vi
    .fn()
    .mockImplementation(async (preferences) => {
      return preferences;
    }),
}));

test("screen reader live region exists", () => {
  render(<AccessibleDashboard/>);

  const liveRegion =
    screen.getByRole("status");

  expect(liveRegion).toHaveAttribute(
    "aria-live",
    "polite"
  );

  expect(liveRegion).toHaveAttribute(
    "aria-atomic",
    "true"
  );
});

test("screen reader receives accessibility preference announcement", async () => {
  const user = userEvent.setup();

  render(<AccessibleDashboard />);

  const highContrastButton =
    screen.getByRole("button", {
      name: /high contrast/i,
    });

  await user.click(highContrastButton);

  const liveRegion =
    screen.getByRole("status");

  expect(liveRegion).toHaveTextContent(
    "High contrast enabled."
  );
});

test("interactive controls have accessible names", () => {
  render(<AccessibleDashboard />);

  expect(
    screen.getByRole("button", {
      name: /high contrast/i,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: /reduced motion/i,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: /screen reader announcements/i,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: /view details for aarav sharma/i,
    })
  ).toBeInTheDocument();
});