const { employees } = require('../data/employees.data');

let nextId = employees.length + 1;

/**
 * Returns a filtered, sorted, paginated slice of employees.
 * Keeping this logic in a service (rather than the controller) means
 * it can be unit tested without spinning up Express or mocking req/res.
 */
function getEmployees({ search = '', department = '', status = '', sortBy = 'name', sortDir = 'asc', page = 1, pageSize = 8 }) {
  let result = [...employees];

  if (search) {
    const term = search.toLowerCase();
    result = result.filter((emp) =>
      emp.name.toLowerCase().includes(term) ||
      emp.role.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term)
    );
  }

  if (department) {
    result = result.filter((emp) => emp.department === department);
  }

  if (status) {
    result = result.filter((emp) => emp.status === status);
  }

  const validSortFields = ['name', 'role', 'department', 'location', 'status'];
  const field = validSortFields.includes(sortBy) ? sortBy : 'name';
  const dir = sortDir === 'desc' ? -1 : 1;

  result.sort((a, b) => a[field].localeCompare(b[field]) * dir);

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = result.slice(start, start + pageSize);

  return {
    items,
    pagination: { page: safePage, pageSize, total, totalPages },
    sort: { sortBy: field, sortDir: dir === 1 ? 'asc' : 'desc' }
  };
}

function getEmployeeById(id) {
  return employees.find((emp) => emp.id === Number(id)) || null;
}

function createEmployee(payload) {
  const employee = { id: nextId++, status: 'Active', bio: '', ...payload };
  employees.push(employee);
  return employee;
}

function updateEmployee(id, payload) {
  const index = employees.findIndex((emp) => emp.id === Number(id));
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...payload, id: employees[index].id };
  return employees[index];
}

function deleteEmployee(id) {
  const index = employees.findIndex((emp) => emp.id === Number(id));
  if (index === -1) return false;
  employees.splice(index, 1);
  return true;
}

function getDepartments() {
  return [...new Set(employees.map((emp) => emp.department))].sort();
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartments
};
