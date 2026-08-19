import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import EmployeeDetail from '../components/EmployeeDetail/EmployeeDetail.jsx';

expect.extend(toHaveNoViolations);

const employee = {
  id: 1,
  name: 'Ava Thompson',
  role: 'Frontend Engineer',
  department: 'Engineering',
  location: 'Remote - UK',
  status: 'Active',
  email: 'ava.thompson@example.com',
  bio: 'Focuses on accessible component architecture.'
};

describe('EmployeeDetail modal accessibility', () => {
  it('has no detectable axe violations when open', async () => {
    const { baseElement } = render(<EmployeeDetail employee={employee} isOpen onClose={vi.fn()} />);
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });

  it('exposes role="dialog", aria-modal, and an accessible name', () => {
    render(<EmployeeDetail employee={employee} isOpen onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: /ava thompson/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus into the dialog when opened', () => {
    render(<EmployeeDetail employee={employee} isOpen onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<EmployeeDetail employee={employee} isOpen onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('traps Tab focus within the dialog', async () => {
    const user = userEvent.setup();
    render(<EmployeeDetail employee={employee} isOpen onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll('button, a[href]');
    const last = focusable[focusable.length - 1];

    last.focus();
    await user.keyboard('{Tab}');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});
