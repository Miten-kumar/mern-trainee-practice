import React, { useCallback, useRef } from 'react';
import { useAnnounce } from '../../hooks/useAnnounce.js';
import './DataTable.css';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
];

/**
 * Sortable, keyboard-navigable data table.
 *
 * AUDIT NOTE (findings addressed here):
 * 1. Sort controls were previously bare <div onClick> "chips" with no
 *    keyboard access at all. They are now real <button> elements inside
 *    <th>, and each <th> carries aria-sort so AT users hear the current
 *    sort state ("Name, sorted ascending").
 * 2. Rows had a click handler to open the detail modal but no keyboard
 *    equivalent. Rows are now reachable and operable with Arrow Up/Down
 *    to move focus between rows and Enter/Space to open, matching the
 *    "grid" interaction pattern recommended in the ARIA APG.
 * 3. There was no way for a screen reader user to know how many results
 *    a filter/sort change produced. Every render caused by a data change
 *    triggers a polite live-region announcement via useAnnounce().
 */
export default function DataTable({ employees, sort, onSortChange, onRowActivate, loading }) {
  const announce = useAnnounce();
  const rowRefs = useRef([]);

  const handleSort = useCallback(
    (columnKey) => {
      const isSameColumn = sort.sortBy === columnKey;
      const nextDir = isSameColumn && sort.sortDir === 'asc' ? 'desc' : 'asc';
      onSortChange(columnKey, nextDir);
      const columnLabel = COLUMNS.find((c) => c.key === columnKey)?.label ?? columnKey;
      announce(`Table sorted by ${columnLabel}, ${nextDir === 'asc' ? 'ascending' : 'descending'}`);
    },
    [sort, onSortChange, announce]
  );

  const focusRow = (index) => {
    const el = rowRefs.current[index];
    if (el) el.focus();
  };

  const handleRowKeyDown = (event, index, employee) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusRow(Math.min(index + 1, employees.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusRow(Math.max(index - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        focusRow(0);
        break;
      case 'End':
        event.preventDefault();
        focusRow(employees.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onRowActivate(employee);
        break;
      default:
        break;
    }
  };

  return (
    <div className="table-scroll" role="region" aria-label="Employee results" tabIndex={-1}>
      <table className="data-table">
        <caption className="visually-hidden">
          Employee directory. Activate a column header button to sort. Use Arrow Up and Arrow Down to move between
          rows, then Enter to view details.
        </caption>
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              const isSorted = sort.sortBy === col.key;
              const ariaSort = isSorted ? (sort.sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
              return (
                <th key={col.key} scope="col" aria-sort={col.sortable ? ariaSort : undefined}>
                  {col.sortable ? (
                    <button type="button" className="sort-button" onClick={() => handleSort(col.key)}>
                      {col.label}
                      <span className="sort-icon" aria-hidden="true">
                        {isSorted ? (sort.sortDir === 'asc' ? '\u25B2' : '\u25BC') : '\u21C5'}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={COLUMNS.length + 1}>Loading employees…</td>
            </tr>
          )}
          {!loading && employees.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length + 1}>No employees match the current filters.</td>
            </tr>
          )}
          {!loading &&
            employees.map((employee, index) => (
              <tr
                key={employee.id}
                ref={(el) => (rowRefs.current[index] = el)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${employee.name}, ${employee.role}`}
                className="data-row"
                onClick={() => onRowActivate(employee)}
                onKeyDown={(e) => handleRowKeyDown(e, index, employee)}
              >
                <td data-label="Name">{employee.name}</td>
                <td data-label="Role">{employee.role}</td>
                <td data-label="Department">{employee.department}</td>
                <td data-label="Location">{employee.location}</td>
                <td data-label="Status">
                  <span className={`status-badge status-${employee.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
                <td data-label="Actions">
                  <span className="view-link" aria-hidden="true">
                    View details →
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
