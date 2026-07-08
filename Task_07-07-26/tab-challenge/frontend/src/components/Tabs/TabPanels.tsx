import { Children, cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";
import type { TabPanelsProps, TabPanelProps } from "./types";

export function TabPanels({ children }: TabPanelsProps) {
  return (
    <div className="tab-panels">
      {Children.map(children, (child, i) =>
        isValidElement(child) ? cloneElement(child as ReactElement<TabPanelProps>, { index: i }) : child
      )}
    </div>
  );
}
