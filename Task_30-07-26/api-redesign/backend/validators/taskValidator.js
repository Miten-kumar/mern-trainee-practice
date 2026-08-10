const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

// partial=true means this is a PATCH - only fields actually present
// on the body get validated, everything else is left alone. partial
// false (PUT/POST) means title is always required.
function validateTask(body, { partial = false } = {}) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return [{ field: 'body', message: 'Request body must be a JSON object' }];
  }

  const has = (field) => Object.prototype.hasOwnProperty.call(body, field);

  if (!partial || has('title')) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'title is required and must be a non-empty string' });
    } else if (body.title.length > 200) {
      errors.push({ field: 'title', message: 'title must be 200 characters or fewer' });
    }
  }

  if (has('status') && !STATUSES.includes(body.status)) {
    errors.push({ field: 'status', message: `status must be one of: ${STATUSES.join(', ')}` });
  }

  if (has('priority') && !PRIORITIES.includes(body.priority)) {
    errors.push({ field: 'priority', message: `priority must be one of: ${PRIORITIES.join(', ')}` });
  }

  if (has('dueDate') && body.dueDate !== null && isNaN(Date.parse(body.dueDate))) {
    errors.push({ field: 'dueDate', message: 'dueDate must be a valid ISO date string, or null' });
  }

  return errors;
}

module.exports = { validateTask, STATUSES, PRIORITIES };
