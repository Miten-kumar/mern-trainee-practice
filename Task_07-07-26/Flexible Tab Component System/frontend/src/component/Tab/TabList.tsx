import type { ReactNode } from "react";

interface TabListProps {
  children: ReactNode;
}

const TabList = ({ children }: TabListProps) => {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        borderBottom: "2px solid #ddd",
        paddingBottom: "10px",
      }}
    >
      {children}
    </div>
  );
};

export default TabList;