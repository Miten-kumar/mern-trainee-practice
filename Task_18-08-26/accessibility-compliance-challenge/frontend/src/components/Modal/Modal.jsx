import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import './Modal.css';

/**
 * AUDIT NOTE (findings addressed here):
 * 1. The original modal was a plain positioned <div> with no role, so
 *    screen readers announced nothing when it opened and kept reading the
 *    page underneath. It now uses role="dialog", aria-modal="true", and
 *    aria-labelledby pointing at the visible heading.
 * 2. Escape did not close the modal. It now does, and clicking the
 *    backdrop also closes it (with the click handled only on the
 *    backdrop itself, not bubbling from dialog content).
 * 3. Background content remained in the accessibility tree while the
 *    modal was open, so screen reader users could navigate "through" the
 *    dialog into the page behind it. inert (with a polyfill-safe
 *    aria-hidden fallback) is applied to the app root while open.
 * 4. Focus previously stayed wherever it was on the trigger page. It now
 *    moves into the dialog on open and returns to the trigger element on
 *    close via useFocusTrap.
 */
export default function Modal({ isOpen, onClose, titleId, children }) {
  const dialogRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const root = document.getElementById('root');
    root?.setAttribute('inert', '');
    root?.setAttribute('aria-hidden', 'true');

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);

    // Prevent the page behind the modal from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      root?.removeAttribute('inert');
      root?.removeAttribute('aria-hidden');
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Rendered via portal directly under <body>, sibling to #root, so that
  // marking #root inert/aria-hidden (above) never hides the dialog itself.
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
