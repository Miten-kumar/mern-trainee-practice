import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

test("focus moves into modal when opened", async () => {
  const user = userEvent.setup();

  render(<AccessibleDashboard />);

  const viewButton = screen.getByRole("button", {
    name: /view details for aarav sharma/i,
  });

  viewButton.focus();

  await user.click(viewButton);

  const dialog = await screen.findByRole("dialog");

  expect(dialog).toBeInTheDocument();

  await waitFor(() => {
    expect(document.activeElement).not.toBe(viewButton);
  });
});

test("Escape closes the modal", async () => {
  const user = userEvent.setup();

  render(<AccessibleDashboard />);

  const viewButton = screen.getByRole("button", {
    name: /view details for aarav sharma/i,
  });

  await user.click(viewButton);

  expect(screen.getByRole("dialog")).toBeInTheDocument();

  await user.keyboard("{Escape}");

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("focus is restored after closing modal", async () => {
  const user = userEvent.setup();

  render(<AccessibleDashboard />);

  const viewButton = screen.getByRole("button", {
    name: /view details for aarav sharma/i,
  });

  await user.click(viewButton);

  await screen.findByRole("dialog");

  await user.keyboard("{Escape}");

  await waitFor(() => {
    expect(viewButton).toHaveFocus();
  });
});

test("Tab focus remains inside the modal", async () => {
  const user = userEvent.setup();

  render(<AccessibleDashboard />);

  const viewButton = screen.getByRole("button", {
    name: /view details for aarav sharma/i,
  });

  await user.click(viewButton);

  const dialog = await screen.findByRole("dialog");

  const closeButton = screen.getByRole("button", {
    name: /close .* dialog/i,
  });

  const doneButton = screen.getByRole("button", {
    name: /done/i,
  });

  expect(dialog).toContainElement(closeButton);
  expect(dialog).toContainElement(doneButton);

  closeButton.focus();

  expect(closeButton).toHaveFocus();

  await user.keyboard("{Tab}");

  expect(doneButton).toHaveFocus();

  await user.keyboard("{Tab}");

  expect(closeButton).toHaveFocus();
});