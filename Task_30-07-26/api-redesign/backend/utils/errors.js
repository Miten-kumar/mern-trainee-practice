// base class every api error extends - carries everything the error
// handler needs to build a consistent "problem details" response
// (RFC 7807: https://datatracker.ietf.org/doc/html/rfc7807)
class ApiError extends Error {
  constructor(status, title, detail, instance, errors) {
    super(detail || title);
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.instance = instance;
    this.errors = errors; // optional array of { field, message } for validation errors
  }
}

class NotFoundError extends ApiError {
  constructor(detail, instance) {
    super(404, 'Not Found', detail, instance);
  }
}

class ValidationError extends ApiError {
  constructor(errors, instance) {
    super(400, 'Validation Failed', 'The request contains invalid fields, see errors for details', instance, errors);
  }
}

class ConflictError extends ApiError {
  constructor(detail, instance) {
    super(409, 'Conflict', detail, instance);
  }
}

module.exports = { ApiError, NotFoundError, ValidationError, ConflictError };
