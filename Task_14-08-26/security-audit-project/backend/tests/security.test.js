/**
 * Regression tests that pin down the fixes so nobody accidentally
 * reintroduces a vulnerability in a future PR. Run with `npm test`.
 */

const request = require('supertest');
process.env.JWT_SECRET = 'test_jwt_secret_at_least_32_chars_long';
process.env.CSRF_SECRET = 'test_csrf_secret_at_least_32_chars';
process.env.COOKIE_SECRET = 'test_cookie_secret';
process.env.DATABASE_PATH = ':memory:';
process.env.NODE_ENV = 'test';

const app = require('../src/app');

describe('SQL injection (SEC-01)', () => {
  it("rejects a classic injection payload in the login username without a 500 or auth bypass", async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: "admin' OR '1'='1", password: "x" });
    expect(res.status).not.toBe(200);
    expect(res.status).not.toBe(500);
  });
});

describe('Security headers (SEC-05)', () => {
  it('sets Content-Security-Policy and does not leak X-Powered-By', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
  });
});

describe('CSRF protection (SEC-03)', () => {
  it('rejects a mutating request with no CSRF token', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'hi', body: 'hi' });
    expect([401, 403]).toContain(res.status);
  });
});

describe('Rate limiting (SEC-07)', () => {
  it('throttles repeated login attempts', async () => {
    const attempts = Array.from({ length: 12 }, () =>
      request(app).post('/api/auth/login').send({ username: 'x', password: 'x' })
    );
    const results = await Promise.all(attempts);
    expect(results.some((r) => r.status === 429)).toBe(true);
  });
});
