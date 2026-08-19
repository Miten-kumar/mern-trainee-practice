import React from 'react';
import './Button.css';

/**
 * A native <button> wrapper. Deliberately NOT a styled <div onClick>,
 * which was the pattern found during the audit (see ACCESSIBILITY_AUDIT.md,
 * finding #1) — divs-as-buttons get no keyboard focus, no Enter/Space
 * activation, and no button semantics for screen readers unless a large
 * amount of ARIA is bolted on. A real <button> gets all of that for free.
 */
export default function Button({ variant = 'primary', as: Tag = 'button', children, ...rest }) {
  return (
    <Tag className={`btn btn-${variant}`} {...rest}>
      {children}
    </Tag>
  );
}
