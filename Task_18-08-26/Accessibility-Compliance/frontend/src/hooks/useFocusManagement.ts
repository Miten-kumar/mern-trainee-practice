import {
  useCallback,
  useEffect,
  useRef,
} from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

interface UseFocusManagementOptions {
  isOpen: boolean;
  onEscape?: () => void;
}

export const useFocusManagement = ({
  isOpen,
  onEscape,
}: UseFocusManagementOptions) => {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const triggerRef =
    useRef<HTMLElement | null>(null);

  const previousFocusRef =
    useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) {
      return [];
    }

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR
      )
    ).filter(
      (element) =>
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-hidden") !== "true"
    );
  }, []);

  const setTrigger = useCallback(
    (element: HTMLElement | null) => {
      triggerRef.current = element;
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusTimer = window.setTimeout(() => {
      const focusableElements =
        getFocusableElements();

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        containerRef.current?.focus();
      }
    }, 0);

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      if (
        event.key !== "Tab" ||
        !containerRef.current
      ) {
        return;
      }

      const focusableElements =
        getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement =
        focusableElements[0];

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.clearTimeout(focusTimer);

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      const elementToFocus =
        triggerRef.current ??
        previousFocusRef.current;

      if (elementToFocus) {
        window.setTimeout(() => {
          elementToFocus.focus();
        }, 0);
      }
    };
  }, [
    isOpen,
    onEscape,
    getFocusableElements,
  ]);

  return {
    containerRef,
    setTrigger,
  };
};