// Bull priority: lower number = processed first. we expose friendly
// names in the API instead of making callers know that detail.
const PRIORITY_MAP = {
  high: 1,
  normal: 5,
  low: 10,
};

function mapPriority(priority) {
  if (!priority) return PRIORITY_MAP.normal;
  return PRIORITY_MAP[priority] ?? PRIORITY_MAP.normal;
}

module.exports = { mapPriority, PRIORITY_MAP };
