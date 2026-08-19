import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { AnnouncerProvider } from '../context/AnnouncerContext.jsx';
import DataTable from '../components/DataTable/DataTable.jsx';

expect.extend(toHaveNoViolations);

const employees = [
  { id: 1, name: 'Ava Thompson', role: 'Frontend Engineer', department: 'Engineering', location: 'Remote', status: 'Active' },
  { id: 2, name: 'Marcus Lee', role: 'Backend Engineer', department: 'Engineering', location: 'Austin', status: 'Active' },
  { id: 3, name: 'Priya Nair', role: 'Product Designer', department: 'Design', location: 'Remote', status: 'On Leave' }
];

function renderTable(overrides = {}) {
  const props = {
    employees,
    sort: { sortBy: 'name', sortDir: 'asc' },
    onSortChange: vi.fn(),
    onRowActivate: vi.fn(),
    loading: false,
    ...overrides
  };
  render(
    <AnnouncerProvider>
      <DataTable {...props} />
    </AnnouncerProvider>
  );
  return props;
}

describe('DataTable accessibility', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(
      <AnnouncerProvider>
        <DataTable
          employees={employees}
          sort={{ sortBy: 'name', sortDir: 'asc' }}
          onSortChange={vi.fn()}
          onRowActivate={vi.fn()}
          loading={false}
        />
      </AnnouncerProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('marks the sorted column with aria-sort', () => {
    renderTable();
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('calls onSortChange when a sortable header button is activated', async () => {
    const user = userEvent.setup();
    const props = renderTable();
    await user.click(screen.getByRole('button', { name: /role/i }));
    expect(props.onSortChange).toHaveBeenCalledWith('role', 'asc');
  });

  it('supports arrow-key navigation between rows and Enter to activate', async () => {
    const user = userEvent.setup();
    const props = renderTable();
    const rows = screen.getAllByRole('button', { name: /view details for/i });

    rows[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(rows[1]).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(props.onRowActivate).toHaveBeenCalledWith(employees[1]);
  });

  it('exposes an accessible name for each row via aria-label', () => {
    renderTable();
    expect(screen.getByRole('button', { name: /view details for ava thompson/i })).toBeInTheDocument();
  });
});
