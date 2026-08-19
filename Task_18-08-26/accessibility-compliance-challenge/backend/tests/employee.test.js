const request = require('supertest');
const app = require('../src/app');

describe('GET /api/employees', () => {
  it('returns a paginated list of employees', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.pagination).toHaveProperty('total');
  });

  it('filters employees by search term', async () => {
    const res = await request(app).get('/api/employees?search=Ava');
    expect(res.status).toBe(200);
    expect(res.body.data.every((e) => e.name.includes('Ava'))).toBe(true);
  });

  it('filters employees by department', async () => {
    const res = await request(app).get('/api/employees?department=Design');
    expect(res.status).toBe(200);
    expect(res.body.data.every((e) => e.department === 'Design')).toBe(true);
  });

  it('sorts employees by name descending', async () => {
    const res = await request(app).get('/api/employees?sortBy=name&sortDir=desc');
    const names = res.body.data.map((e) => e.name);
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });
});

describe('GET /api/employees/:id', () => {
  it('returns a single employee when found', async () => {
    const res = await request(app).get('/api/employees/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  it('returns 404 when the employee does not exist', async () => {
    const res = await request(app).get('/api/employees/9999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/employees', () => {
  it('rejects a payload missing required fields', async () => {
    const res = await request(app).post('/api/employees').send({ name: 'No Email' });
    expect(res.status).toBe(422);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('creates an employee with a valid payload', async () => {
    const payload = {
      name: 'Test User',
      role: 'QA Tester',
      department: 'Engineering',
      email: 'test.user@example.com',
      location: 'Remote'
    };
    const res = await request(app).post('/api/employees').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test User');
  });
});

describe('GET /api/employees/departments', () => {
  it('returns a unique, sorted list of departments', async () => {
    const res = await request(app).get('/api/employees/departments');
    expect(res.status).toBe(200);
    const sorted = [...res.body.data].sort();
    expect(res.body.data).toEqual(sorted);
  });
});
