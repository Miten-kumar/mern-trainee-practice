// Deprecation and Sunset are real, standardized HTTP headers (RFC 8594
// for Sunset, an IETF draft for Deprecation) - clients and tooling
// (including browsers' devtools and some http libraries) can pick
// these up automatically, which is why we use headers here instead of
// stuffing a warning message into the response body.
const V2_TASKS_URL = 'http://localhost:4000/api/v2/tasks';
const SUNSET_DATE = 'Wed, 31 Dec 2026 23:59:59 GMT';

function deprecationNotice(req, res, next) {
  res.set('Deprecation', 'true');
  res.set('Sunset', SUNSET_DATE);
  res.set('Link', `<${V2_TASKS_URL}>; rel="successor-version"`);
  next();
}

module.exports = deprecationNotice;
