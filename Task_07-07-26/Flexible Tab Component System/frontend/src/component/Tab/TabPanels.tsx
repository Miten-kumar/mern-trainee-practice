import type { ReactNode } from "react";

interface TabPanelsProps {
  children: ReactNode;
}

const TabPanels = ({ children }: TabPanelsProps) => {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
      }}
    >
      {children}
    </div>
  );
};

export default TabPanels;