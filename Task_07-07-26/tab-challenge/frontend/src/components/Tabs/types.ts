import type { ReactNode } from "react";

export interface TabsProps {
  children: ReactNode;
  /** controlled active index - if provided, Tabs no longer manages its own state */
  index?: number;
  /** starting index for uncontrolled mode, ignored if `index` is passed */
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export interface TabListProps {
  children: ReactNode;
}

export interface TabProps {
  /** injected automatically by TabList, don't pass this by hand */
  index?: number;
  children: ReactNode;
  disabled?: boolean;
}

export interface TabPanelsProps {
  children: ReactNode;
}

export interface TabPanelProps {
  /** injected automatically by TabPanels, don't pass this by hand */
  index?: number;
  children: ReactNode;
  /** keep the panel mounted after it's first visited (default true) */
  keepMounted?: boolean;
}
