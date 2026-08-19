import React from 'react';

/**
 * AUDIT NOTE: keyboard users previously had to tab through the entire header
 * and filter toolbar on every page load just to reach the table. A skip
 * link, hidden until focused, jumps straight to #main-content.
 */
export default function SkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
  );
}
