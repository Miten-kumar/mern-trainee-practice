const { validateEmployeePayload } = require('../models/employee.model');
const { failure } = require('../utils/apiResponse');

function validateEmployeeBody(req, res, next) {
  const { isValid, errors } = validateEmployeePayload(req.body);
  if (!isValid) {
    return failure(res, { message: 'Validation failed', status: 422, errors });
  }
  next();
}

module.exports = { validateEmployeeBody };
