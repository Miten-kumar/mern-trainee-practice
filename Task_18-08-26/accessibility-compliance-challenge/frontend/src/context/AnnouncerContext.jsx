import React, { createContext, useCallback, useRef, useState } from 'react';

/**
 * Centralized aria-live announcer.
 *
 * AUDIT NOTE: the original app showed status changes (result counts, sort
 * order, errors) as purely visual text updates. Screen reader users got no
 * indication anything happened unless they were already focused on that
 * text. This context exposes an `announce()` function any component can
 * call, which writes into a single shared aria-live region rendered once
 * at the app root — avoiding duplicate/competing live regions.
 */
export const AnnouncerContext = createContext(() => {});

export function AnnouncerProvider({ children }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const clearTimer = useRef(null);

  const announce = useCallback((message, { assertive = false } = {}) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);

    // Clearing then re-setting on a microtask forces some screen readers
    // (notably NVDA + Firefox) to re-announce identical consecutive
    // messages, e.g. "3 results found" -> "3 results found" after a
    // no-op filter change.
    if (assertive) {
      setAssertiveMessage('');
      requestAnimationFrame(() => setAssertiveMessage(message));
    } else {
      setPoliteMessage('');
      requestAnimationFrame(() => setPoliteMessage(message));
    }

    clearTimer.current = setTimeout(() => {
      if (assertive) setAssertiveMessage('');
      else setPoliteMessage('');
    }, 5000);
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {politeMessage}
      </div>
      <div aria-live="assertive" aria-atomic="true" className="visually-hidden">
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}
