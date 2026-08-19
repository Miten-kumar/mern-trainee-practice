function success(res, { data, meta = null, message = 'OK', status = 200 }) {
  return res.status(status).json({ success: true, message, data, meta });
}

function failure(res, { message = 'Something went wrong', status = 500, errors = [] }) {
  return res.status(status).json({ success: false, message, errors });
}

module.exports = { success, failure };
