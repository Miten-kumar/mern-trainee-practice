import { useTabs } from "./Tabcontext";
import type { ReactNode, KeyboardEvent } from "react";

interface TabProps {
  index: number;
  children: ReactNode;
}

const Tab = ({ index, children }: TabProps) => {
  const { activeIndex, setActiveIndex } = useTabs();

  const handleClick = () => {
    setActiveIndex(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowRight":
        setActiveIndex((prev) => prev + 1);
        break;

      case "ArrowLeft":
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;

      case "Home":
        setActiveIndex(0);
        break;

      default:
        break;
    }
  };

  return (
    <button
      role="tab"
      tabIndex={activeIndex === index ? 0 : -1}
      aria-selected={activeIndex === index}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        padding: "12px 20px",
        margin: "5px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor:
          activeIndex === index ? "#2563eb" : "#e5e7eb",
        color: activeIndex === index ? "#fff" : "#000",
        fontWeight: "bold",
      }}
    >
      {children}
    </button>
  );
};

export default Tab;