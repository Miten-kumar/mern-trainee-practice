import { useTabsContext } from "./TabsContext";
import type { TabPanelProps } from "./types";

export function TabPanel({ index = 0, children, keepMounted = true }: TabPanelProps) {
  const { activeIndex, visited } = useTabsContext();
  const isActive = activeIndex === index;

  // lazy loading: this panel renders nothing at all until its tab has
  // been selected at least once
  if (!visited.has(index)) return null;

  // after that first visit, keep it mounted so internal state (form
  // inputs, scroll position, etc) survives switching tabs - unless the
  // caller passed keepMounted={false} to opt out of that
  if (!isActive && !keepMounted) return null;

  return (
    <div role="tabpanel" hidden={!isActive} className="tab-panel">
      {children}
    </div>
  );
}
