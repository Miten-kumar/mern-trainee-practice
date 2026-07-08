import { lazy, Suspense } from "react";
import { useTabs } from "./Tabcontext";
import type { ReactNode } from "react";

interface TabPanelProps {
  index: number;
  children: ReactNode;
}

// Lazy wrapper component
const LazyContent = lazy(
  () =>
    Promise.resolve({
      default: ({ children }: { children: ReactNode }) => <>{children}</>,
    })
);

const TabPanel = ({ index, children }: TabPanelProps) => {
  const { activeIndex } = useTabs();

  if (activeIndex !== index) return null;

  return (
    <div
      role="tabpanel"
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        minHeight: "150px",
      }}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <LazyContent>{children}</LazyContent>
      </Suspense>
    </div>
  );
};

export default TabPanel;