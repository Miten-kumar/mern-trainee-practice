import { render } from "@testing-library/react";
import React from "react";
import { axe, toHaveNoViolations } from "jest-axe";
import { expect, test, vi } from "vitest";

import AccessibleDashboard from "../src/components/accessibleDashboard";

expect.extend(toHaveNoViolations);

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

test("AccessibleDashboard has no automated accessibility violations", async () => {
  const { container } = render(
    <AccessibleDashboard />
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});