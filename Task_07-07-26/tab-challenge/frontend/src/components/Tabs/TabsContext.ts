import { createContext, useContext } from "react";

export interface TabsContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  visited: Set<number>;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

// small helper so every child component doesn't have to null-check
// the context itself, it just throws a clear error instead
export function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tab, TabList, TabPanel etc must be used inside <Tabs>");
  }
  return ctx;
}
