import React, { useEffect, useState } from 'react';
import { AnnouncerProvider } from './context/AnnouncerContext.jsx';
import { useAnnounce } from './hooks/useAnnounce.js';
import { useDebounce } from './hooks/useDebounce.js';
import { fetchEmployees, fetchDepartments } from './api/employeeApi.js';
import SkipLink from './components/common/SkipLink.jsx';
import SearchFilter from './components/SearchFilter/SearchFilter.jsx';
import DataTable from './components/DataTable/DataTable.jsx';
import EmployeeDetail from './components/EmployeeDetail/EmployeeDetail.jsx';
import Button from './components/common/Button.jsx';

function DirectoryPage() {
  const announce = useAnnounce();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState({ sortBy: 'name', sortDir: 'asc' });
  const [page, setPage] = useState(1);

  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError(null);

    fetchEmployees({
      search: debouncedSearch,
      department,
      status,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
      page,
      pageSize: 8
    })
      .then((res) => {
        if (!isCurrent) return;
        setEmployees(res.data);
        setPagination(res.meta.pagination);
        announce(`${res.meta.pagination.total} ${res.meta.pagination.total === 1 ? 'result' : 'results'} found`);
      })
      .catch((err) => {
        if (!isCurrent) return;
        setError(err.message);
        announce('There was a problem loading employees.', { assertive: true });
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, department, status, sort, page]);

  // Reset to page 1 whenever a filter changes, otherwise a user could be
  // stranded on a page that no longer exists.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  const openEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app-shell">
      <SkipLink />

      <header className="app-header">
        <h1>Team Directory</h1>
        <p>Search and browse employees. Fully operable by keyboard and screen reader.</p>
      </header>

      <main id="main-content">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          status={status}
          onStatusChange={setStatus}
          departments={departments}
          resultCount={pagination.total}
        />

        {error && (
          <p role="alert" className="error-banner">
            {error}
          </p>
        )}

        <DataTable
          employees={employees}
          sort={sort}
          onSortChange={(sortBy, sortDir) => setSort({ sortBy, sortDir })}
          onRowActivate={openEmployee}
          loading={loading}
        />

        <nav aria-label="Pagination" className="pagination">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <span aria-current="page">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </nav>
      </main>

      <EmployeeDetail employee={selectedEmployee} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default function App() {
  return (
    <AnnouncerProvider>
      <DirectoryPage />
    </AnnouncerProvider>
  );
}
