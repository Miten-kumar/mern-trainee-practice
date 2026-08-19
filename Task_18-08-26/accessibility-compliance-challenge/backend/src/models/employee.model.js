/**
 * Plain JS "model" describing the shape of an employee record and
 * a light validator. Swap this for a Mongoose/Sequelize model if a
 * real database is introduced later — the service layer is the only
 * place that would need to change.
 */

const REQUIRED_FIELDS = ['name', 'role', 'department', 'email', 'location'];

function validateEmployeePayload(payload = {}) {
  const errors = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!payload[field] || typeof payload[field] !== 'string' || !payload[field].trim()) {
      errors.push(`"${field}" is required and must be a non-empty string.`);
    }
  });

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('"email" must be a valid email address.');
  }

  if (payload.status && !['Active', 'Inactive', 'On Leave'].includes(payload.status)) {
    errors.push('"status" must be one of: Active, Inactive, On Leave.');
  }

  return { isValid: errors.length === 0, errors };
}

module.exports = { validateEmployeePayload, REQUIRED_FIELDS };
