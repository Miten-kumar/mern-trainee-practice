import { useEffect, useState } from "react";
import { TabsContext } from "./TabsContext";
import type { TabsProps } from "./types";

export function Tabs({ children, index, defaultIndex = 0, onChange }: TabsProps) {
  const isControlled = index !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = isControlled ? (index as number) : internalIndex;

  // every index that has ever been active gets added here.
  // TabPanel checks this set to decide whether it should render yet -
  // that's what makes panel content "lazy", it only mounts the first
  // time its tab gets selected.
  const [visited, setVisited] = useState<Set<number>>(() => new Set([activeIndex]));

  useEffect(() => {
    setVisited((prev) => {
      if (prev.has(activeIndex)) return prev;
      const next = new Set(prev);
      next.add(activeIndex);
      return next;
    });
  }, [activeIndex]);

  function setActiveIndex(next: number) {
    // only update our own state if nobody outside is controlling it
    if (!isControlled) {
      setInternalIndex(next);
    }
    onChange?.(next);
  }

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex, visited }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}
