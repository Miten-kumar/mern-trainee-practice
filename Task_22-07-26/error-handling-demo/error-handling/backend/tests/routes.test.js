const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const dataFile = path.join(__dirname, '..', 'data', 'errors.json');

describe('POST /api/errors', () => {
  afterEach(() => {
    if (fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));
  });

  it('rejects when message or type is missing', async () => {
    const res = await request(app).post('/api/errors').send({});
    expect(res.status).toBe(400);
  });

  it('saves a valid error log entry', async () => {
    const res = await request(app)
      .post('/api/errors')
      .send({ message: 'fetch failed', type: 'network', stack: 'Error: fetch failed\n at x' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

    const saved = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    expect(saved.length).toBe(1);
    expect(saved[0].type).toBe('network');
  });

  it('returns aggregate counts by type', async () => {
    await request(app).post('/api/errors').send({ message: 'a', type: 'network' });
    await request(app).post('/api/errors').send({ message: 'b', type: 'network' });
    await request(app).post('/api/errors').send({ message: 'c', type: 'runtime' });

    const res = await request(app).get('/api/errors/stats');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.byType.network).toBe(2);
    expect(res.body.byType.runtime).toBe(1);
  });
});

describe('GET /api/demo/profile', () => {
  it('always returns profile data', async () => {
    const res = await request(app).get('/api/demo/profile');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name');
  });
});

describe('GET /api/demo/missing-resource', () => {
  it('always returns 404', async () => {
    const res = await request(app).get('/api/demo/missing-resource');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/demo/stats', () => {
  it('returns either a success or a 503 (it is intentionally flaky)', async () => {
    const res = await request(app).get('/api/demo/stats');
    expect([200, 503]).toContain(res.status);
  });
});
