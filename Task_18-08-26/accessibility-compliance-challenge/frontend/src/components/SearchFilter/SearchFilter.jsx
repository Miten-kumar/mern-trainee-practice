import React, { useId } from 'react';
import './SearchFilter.css';

/**
 * Search + filter toolbar.
 *
 * AUDIT NOTE: the original markup used placeholder text as the only label
 * ("Search..."), which disappears once the user types and is not a
 * reliable accessible name in several browser/AT combinations. Every
 * control here now has a real, visible or visually-hidden <label>
 * connected with htmlFor/id.
 */
export default function SearchFilter({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  departments,
  resultCount
}) {
  const searchId = useId();
  const deptId = useId();
  const statusId = useId();

  return (
    <form className="search-filter" role="search" aria-label="Filter employee directory" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor={searchId}>Search by name, role, or email</label>
        <input
          id={searchId}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="e.g. Ava, Frontend Engineer"
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label htmlFor={deptId}>Department</label>
        <select id={deptId} value={department} onChange={(e) => onDepartmentChange(e.target.value)}>
          <option value="">All departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor={statusId}>Status</label>
        <select id={statusId} value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">Any status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Visible result count doubles as sighted-user feedback; the
          matching aria-live announcement (see DataTable) covers screen
          reader users so this element does not need aria-live itself. */}
      <p className="result-count" aria-hidden="true">
        {resultCount} {resultCount === 1 ? 'result' : 'results'}
      </p>
    </form>
  );
}
