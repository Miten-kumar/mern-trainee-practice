import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

/**
 * Traps Tab/Shift+Tab focus within a container while `active` is true,
 * moves focus into the container on activation, and restores focus to
 * whatever triggered it once deactivated.
 *
 * This is the fix for the audit finding "focus escapes modal to the page
 * behind it" — previously Tab could move focus onto elements hidden
 * behind the overlay, which is both a keyboard trap violation and
 * confusing for screen reader users.
 */
export function useFocusTrap(active) {
  const containerRef = useRef(null);
  const triggerElementRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    triggerElementRef.current = document.activeElement;
    const container = containerRef.current;
    if (!container) return undefined;

    const focusables = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));

    const firstFocusable = focusables()[0];
    (firstFocusable || container).focus();

    function handleKeyDown(event) {
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Return focus to the element that opened the dialog so keyboard
      // users don't lose their place in the page.
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        triggerElementRef.current.focus();
      }
    };
  }, [active]);

  return containerRef;
}
