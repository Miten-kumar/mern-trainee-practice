const request = require('supertest');
const app = require('../app');
const store = require('../data/tasks');

beforeEach(() => {
  store._reset();
});

describe('GET /api/v2/tasks', () => {
  it('returns an embedded list with pagination and links', async () => {
    const res = await request(app).get('/api/v2/tasks');

    expect(res.status).toBe(200);
    expect(res.body._embedded.tasks.length).toBeGreaterThan(0);
    expect(res.body._links.self).toBeDefined();
    expect(res.body.page).toBe(1);
  });

  it('every task in the list includes its own _links', async () => {
    const res = await request(app).get('/api/v2/tasks');
    res.body._embedded.tasks.forEach((task) => {
      expect(task._links.self.href).toContain(`/api/v2/tasks/${task.id}`);
    });
  });

  it('filters by status', async () => {
    const res = await request(app).get('/api/v2/tasks?status=completed');
    res.body._embedded.tasks.forEach((task) => {
      expect(task.status).toBe('completed');
    });
  });

  it('respects limit and page', async () => {
    const res = await request(app).get('/api/v2/tasks?page=1&limit=1');
    expect(res.body._embedded.tasks.length).toBe(1);
    expect(res.body.limit).toBe(1);
  });
});

describe('GET /api/v2/tasks/:id', () => {
  it('returns a single task with links', async () => {
    const res = await request(app).get('/api/v2/tasks/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body._links.update.method).toBe('PUT');
  });

  it('returns a problem+json 404 for a missing task', async () => {
    const res = await request(app).get('/api/v2/tasks/9999');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body.title).toBe('Not Found');
    expect(res.body.status).toBe(404);
  });
});

describe('POST /api/v2/tasks', () => {
  it('creates a task and returns 201 with a Location header', async () => {
    const res = await request(app).post('/api/v2/tasks').send({ title: 'New task' });

    expect(res.status).toBe(201);
    expect(res.headers.location).toContain('/api/v2/tasks/');
    expect(res.body.title).toBe('New task');
    expect(res.body._links.self).toBeDefined();
  });

  it('returns a 400 problem+json with field errors when title is missing', async () => {
    const res = await request(app).post('/api/v2/tasks').send({});

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.body.errors.some((e) => e.field === 'title')).toBe(true);
  });
});

describe('PUT /api/v2/tasks/:id', () => {
  it('replaces a task', async () => {
    const res = await request(app)
      .put('/api/v2/tasks/1')
      .send({ title: 'Replaced', status: 'completed', priority: 'high' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Replaced');
    expect(res.body.status).toBe('completed');
  });

  it('returns 404 for a task that does not exist', async () => {
    const res = await request(app).put('/api/v2/tasks/9999').send({ title: 'x' });
    expect(res.status).toBe(404);
  });

  it('returns 400 when the replacement body is invalid', async () => {
    const res = await request(app).put('/api/v2/tasks/1').send({ title: '' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v2/tasks/:id', () => {
  it('only changes the fields that were sent', async () => {
    const before = await request(app).get('/api/v2/tasks/1');
    const res = await request(app).patch('/api/v2/tasks/1').send({ status: 'in-progress' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in-progress');
    expect(res.body.title).toBe(before.body.title); // untouched
  });

  it('returns 404 for a task that does not exist', async () => {
    const res = await request(app).patch('/api/v2/tasks/9999').send({ status: 'completed' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/v2/tasks/:id', () => {
  it('deletes a task and returns 204', async () => {
    const res = await request(app).delete('/api/v2/tasks/1');
    expect(res.status).toBe(204);

    const followUp = await request(app).get('/api/v2/tasks/1');
    expect(followUp.status).toBe(404);
  });

  it('returns 404 when deleting a task that does not exist', async () => {
    const res = await request(app).delete('/api/v2/tasks/9999');
    expect(res.status).toBe(404);
  });
});

describe('unknown routes', () => {
  it('returns a problem+json 404 instead of an html error page', async () => {
    const res = await request(app).get('/api/v2/not-a-real-endpoint');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/problem+json');
  });
});
