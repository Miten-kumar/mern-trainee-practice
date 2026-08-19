import React from 'react';

/**
 * Renders content that is visible to screen readers but not sighted users.
 * Used for things like extra table header context or icon-only button labels.
 */
export default function VisuallyHidden({ as: Tag = 'span', children }) {
  return <Tag className="visually-hidden">{children}</Tag>;
}
