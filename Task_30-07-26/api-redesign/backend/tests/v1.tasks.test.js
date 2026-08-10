const request = require('supertest');
const app = require('../app');
const store = require('../data/tasks');

beforeEach(() => {
  store._reset();
});

describe('v1 deprecation headers', () => {
  it('marks every v1 response as deprecated', async () => {
    const res = await request(app).get('/api/v1/tasks');

    expect(res.headers['deprecation']).toBe('true');
    expect(res.headers['sunset']).toBeDefined();
    expect(res.headers['link']).toContain('/api/v2/tasks');
    expect(res.headers['link']).toContain('rel="successor-version"');
  });

  it('applies the deprecation headers to every method, not just GET', async () => {
    const res = await request(app).post('/api/v1/tasks').send({ title: 'x' });
    expect(res.headers['deprecation']).toBe('true');
  });
});

describe('v1 basic CRUD still works', () => {
  it('returns a flat array with no HATEOAS links', async () => {
    const res = await request(app).get('/api/v1/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]._links).toBeUndefined();
  });

  it('creates a task', async () => {
    const res = await request(app).post('/api/v1/tasks').send({ title: 'legacy task' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('legacy task');
  });

  it('uses a plain { message } error shape, not problem+json', async () => {
    const res = await request(app).get('/api/v1/tasks/9999');
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
    expect(res.body.title).toBeUndefined(); // that's a v2-only field
  });

  it('deletes a task', async () => {
    const res = await request(app).delete('/api/v1/tasks/1');
    expect(res.status).toBe(204);
  });
});
