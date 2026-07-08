import { TabProvider } from "./Tabcontext";
import type { ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
  value?: number;
  onChange?: (index: number) => void;
  defaultIndex?: number;
}

const Tabs = ({
  children,
  value,
  onChange,
  defaultIndex = 0,
}: TabsProps) => {
  return (
    <TabProvider
      value={value}
      onChange={onChange}
      defaultIndex={defaultIndex}
    >
      {children}
    </TabProvider>
  );
};

export default Tabs;