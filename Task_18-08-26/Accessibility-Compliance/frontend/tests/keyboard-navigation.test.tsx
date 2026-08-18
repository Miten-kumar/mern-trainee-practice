import { render,screen } from "@testing-library/react";
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

test("user can navigate interactive elements using keyboard", async () => {
  const user = userEvent.setup();

  render(<AccessibleDashboard />);

  const highContrastButton =
    screen.getByRole("button", {
      name: /high contrast/i,
    });

  highContrastButton.focus();

  expect(highContrastButton).toHaveFocus();

  await user.keyboard("{Enter}");

  expect(highContrastButton).toHaveAttribute(
    "aria-pressed",
    "true"
  );
});

test("user can activate controls with Space", async () => {
  const user = userEvent.setup();

  render(<AccessibleDashboard />);

  const reducedMotionButton =
    screen.getByRole("button", {
      name: /reduced motion/i,
    });

  reducedMotionButton.focus();

  await user.keyboard(" ");

  expect(reducedMotionButton).toHaveAttribute(
    "aria-pressed",
    "true"
  );
});