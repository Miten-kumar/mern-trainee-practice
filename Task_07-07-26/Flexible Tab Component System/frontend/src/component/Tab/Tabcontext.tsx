import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface TabContextType {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  controlled: boolean;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

interface TabProviderProps {
  children: ReactNode;

  // Controlled Mode
  value?: number;
  onChange?: (index: number) => void;

  // Uncontrolled Mode
  defaultIndex?: number;
}

export const TabProvider = ({
  children,
  value,
  onChange,
  defaultIndex = 0,
}: TabProviderProps) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const controlled = value !== undefined;

  const activeIndex = controlled ? value : internalIndex;

  const setActiveIndex: Dispatch<SetStateAction<number>> = (newValue) => {
    const nextIndex =
      typeof newValue === "function"
        ? newValue(activeIndex)
        : newValue;

    if (controlled) {
      onChange?.(nextIndex);
    } else {
      setInternalIndex(nextIndex);
    }
  };

  return (
    <TabContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        controlled,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error("Tabs components must be used inside <Tabs>");
  }

  return context;
};