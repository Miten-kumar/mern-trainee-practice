const employeeService = require('../services/employee.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');

const listEmployees = asyncHandler(async (req, res) => {
  const { search, department, status, sortBy, sortDir, page, pageSize } = req.query;

  const result = employeeService.getEmployees({
    search,
    department,
    status,
    sortBy,
    sortDir,
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 8
  });

  success(res, {
    data: result.items,
    meta: { pagination: result.pagination, sort: result.sort },
    message: 'Employees retrieved successfully'
  });
});

const getEmployee = asyncHandler(async (req, res) => {
  const employee = employeeService.getEmployeeById(req.params.id);
  if (!employee) {
    return failure(res, { message: `Employee with id ${req.params.id} was not found`, status: 404 });
  }
  success(res, { data: employee, message: 'Employee retrieved successfully' });
});

const createEmployee = asyncHandler(async (req, res) => {
  const employee = employeeService.createEmployee(req.body);
  success(res, { data: employee, message: 'Employee created successfully', status: 201 });
});

const updateEmployee = asyncHandler(async (req, res) => {
  const updated = employeeService.updateEmployee(req.params.id, req.body);
  if (!updated) {
    return failure(res, { message: `Employee with id ${req.params.id} was not found`, status: 404 });
  }
  success(res, { data: updated, message: 'Employee updated successfully' });
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const deleted = employeeService.deleteEmployee(req.params.id);
  if (!deleted) {
    return failure(res, { message: `Employee with id ${req.params.id} was not found`, status: 404 });
  }
  success(res, { data: null, message: 'Employee deleted successfully' });
});

const listDepartments = asyncHandler(async (req, res) => {
  success(res, { data: employeeService.getDepartments(), message: 'Departments retrieved successfully' });
});

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  listDepartments
};
