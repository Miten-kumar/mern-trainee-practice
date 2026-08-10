const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

// clamps whatever the client sent to sane values instead of trusting
// it outright - a negative page or a limit of 10000 would otherwise
// cause weird or expensive responses
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT));
  return { page, limit };
}

function paginate(items, page, limit) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);
  return { pageItems, totalItems, totalPages };
}

module.exports = { parsePagination, paginate, MAX_LIMIT, DEFAULT_LIMIT };
