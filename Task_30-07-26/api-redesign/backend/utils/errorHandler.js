const { ApiError } = require('./errors');

// every error response from v2 has the same shape (RFC 7807 "problem
// details"), whether it's a 404, a validation failure, or a genuine
// server bug - callers only ever need to handle one error format
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    const body = {
      type: 'about:blank',
      title: err.title,
      status: err.status,
      detail: err.detail,
      instance: err.instance || req.originalUrl,
    };
    if (err.errors) body.errors = err.errors;

    return res.status(err.status).type('application/problem+json').json(body);
  }

  // anything that isn't one of our own error classes is unexpected -
  // log it properly, but don't leak internals to the client
  console.error(err);
  res.status(500).type('application/problem+json').json({
    type: 'about:blank',
    title: 'Internal Server Error',
    status: 500,
    detail: 'Something went wrong on the server',
    instance: req.originalUrl,
  });
}

module.exports = errorHandler;
