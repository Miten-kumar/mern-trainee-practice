import { Children, cloneElement, isValidElement, useRef } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import { useTabsContext } from "./TabsContext";
import type { TabListProps, TabProps } from "./types";

export function TabList({ children }: TabListProps) {
  const { activeIndex, setActiveIndex } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);
  const tabCount = Children.count(children);

  function focusTabAt(nextIndex: number) {
    const container = listRef.current;
    if (!container) return;
    const buttons = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons[nextIndex]?.focus();
  }

  // arrow keys move focus AND selection together (this is the standard
  // WAI-ARIA "automatic activation" pattern for tabs)
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    let nextIndex: number | null = null;

    switch (e.key) {
      case "ArrowRight":
        nextIndex = (activeIndex + 1) % tabCount;
        break;
      case "ArrowLeft":
        nextIndex = (activeIndex - 1 + tabCount) % tabCount;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabCount - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    setActiveIndex(nextIndex);
    focusTabAt(nextIndex);
  }

  return (
    <div role="tablist" className="tab-list" ref={listRef} onKeyDown={handleKeyDown}>
      {Children.map(children, (child, i) =>
        isValidElement(child) ? cloneElement(child as ReactElement<TabProps>, { index: i }) : child
      )}
    </div>
  );
}
