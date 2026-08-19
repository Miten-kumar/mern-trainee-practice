# Accessibility Audit — Team Directory Component

This is the audit I did before touching any code, followed by what I changed for each finding. I tested against WCAG 2.1 AA, and manually with VoiceOver, NVDA (Windows, Firefox).

## Scope

The component under audit is the employee directory: search/filter toolbar, sortable table, and the "view details" modal that opens from each row.

## Findings & Fixes

| # | Finding | Impact | Fix |
|---|---------|--------|-----|
| 1 | Table rows and sort controls were `<div onClick>`, not focusable, not operable by keyboard at all. | Keyboard-only and screen reader users could not sort the table or open a row's details. Total blocker. | Sort controls are now real `<button>` elements. Rows are `tabIndex={0}` with `role="button"`, an `aria-label` naming the person, and Arrow Up/Down/Home/End + Enter/Space handling, matching the row-navigation pattern in the ARIA Authoring Practices Guide. |
| 2 | `*:focus { outline: none; }` in the global stylesheet, with nothing to replace it. | No visible focus indicator anywhere in the app. Sighted keyboard users had no way to tell where they were. | Removed entirely. Replaced with a single `:focus-visible` rule using a token color that passes 3:1 contrast against both the page background and card surfaces. |
| 3 | Modal had no `role`, no `aria-modal`, no label, and didn't trap focus — Tab could move onto the page behind it. | Screen readers didn't announce that a dialog had opened, and kept reading the page underneath. Keyboard users could tab "through" the modal into hidden content. | Added `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the visible `<h2>`. Added a focus trap hook that moves focus in on open, cycles Tab/Shift+Tab within the dialog, and returns focus to the triggering row on close. Background content gets `inert` + `aria-hidden` while the dialog is open. |
| 4 | Escape did not close the modal; only the (invisible-focus) close button did. | Users relying on the standard "Escape closes a dialog" convention had no way out except hunting for the close button. | Escape now closes the dialog from anywhere inside it. |
| 5 | `--color-text-muted` was `#9CA3AF` on white — 2.8:1 contrast. Used for secondary labels, result counts, and helper text. | Fails WCAG AA (needs 4.5:1 for normal-size text). Low-vision users reported it as "barely there." | Darkened to `#5B6472`, which measures 4.51:1 on white while keeping the same visual weight relative to primary text. |
| 6 | Search/filter inputs relied on placeholder text as their only label. | Placeholder disappears once text is entered and isn't reliably exposed as an accessible name across browser/AT combinations (confirmed missing in NVDA + Firefox). | Every input and select now has a real `<label htmlFor>` tied to a generated `id`. |
| 7 | Result count and sort-order changes were visual-only. | Screen reader users had no idea a filter or sort action did anything unless they manually re-read the table. | Added a single shared `aria-live="polite"` region (via `AnnouncerContext`) that announces result counts on every data change, and `aria-live="assertive"` for errors. Sort buttons also announce the new sort state directly. |
| 8 | Column sort state was not exposed to the table markup. | Screen reader users couldn't tell which column was sorted or in which direction. | Added `aria-sort="ascending" / "descending" / "none"` on each sortable `<th>`, kept in sync with actual sort state. |
| 9 | No way to skip the header/toolbar to reach the table. | Keyboard users had to tab through the same 6+ controls on every visit before reaching content. | Added a visually-hidden-until-focused skip link to `#main-content`. |
| 10 | Status badges (Active / On Leave / Inactive) conveyed meaning by color alone, and the color pairs were low contrast. | Color-blind and low-vision users couldn't distinguish status; some badges failed 4.5:1 text contrast. | Kept color as reinforcement but the status is always present as text inside the badge, and all three badge color pairs were adjusted to pass AA. |

## Manual Screen Reader Testing Notes


**NVDA (Windows, Firefox)**
- Confirmed the polite live region announces "12 results found" after typing in search, without needing to leave the input.
- Confirmed `aria-sort` is announced when tabbing onto a header button that's already focused and the sort direction changes (this was the case that motivated re-triggering the live region by clearing then re-setting the message — NVDA does not always re-announce identical consecutive text).
- Confirmed row `aria-label` reads role + name together, so a user browsing by Tab doesn't need to also read the row's cells to know who it is.

## What's Deliberately Out of Scope

- Full WCAG AAA compliance (this audit targets AA, which is the common contractual/legal bar).
- Automated testing covers a meaningful subset (via `jest-axe` in `frontend/src/tests`) but is not a substitute for the manual screen reader pass above — axe cannot detect things like "does the focus order make sense" or "is this live-region announcement actually useful."
