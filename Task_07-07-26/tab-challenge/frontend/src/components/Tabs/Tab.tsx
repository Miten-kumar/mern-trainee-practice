import { useTabsContext } from "./TabsContext";
import type { TabProps } from "./types";

export function Tab({ index = 0, children, disabled }: TabProps) {
  const { activeIndex, setActiveIndex } = useTabsContext();
  const isActive = activeIndex === index;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      // roving tabindex: only the active tab is in the normal tab order,
      // the rest are reachable with arrow keys instead (see TabList)
      tabIndex={isActive ? 0 : -1}
      className={`tab${isActive ? " tab-active" : ""}`}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
}
