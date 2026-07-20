// simple hand-rolled sanitizer - not trying to catch every possible
// attack, just the common stuff: strip html tags (basic xss defense),
// trim whitespace, and cap length so nobody can send a 5mb string into
// a "username" field
const MAX_STRING_LENGTH = 500;

function sanitizeValue(value) {
  if (typeof value !== "string") return value;

  let clean = value.trim();
  clean = clean.replace(/<[^>]*>/g, ""); // strip anything that looks like an html tag
  clean = clean.slice(0, MAX_STRING_LENGTH);

  return clean;
}

function sanitizeObject(obj) {
  for (const key of Object.keys(obj)) {
    obj[key] = sanitizeValue(obj[key]);
  }
}

// runs on body, query and params - covers most places user input comes from
function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === "object") sanitizeObject(req.body);
  if (req.query && typeof req.query === "object") sanitizeObject(req.query);
  if (req.params && typeof req.params === "object") sanitizeObject(req.params);
  next();
}

module.exports = { sanitizeInput };
