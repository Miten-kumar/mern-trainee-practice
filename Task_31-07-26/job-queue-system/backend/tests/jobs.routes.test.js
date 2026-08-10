jest.mock('../queues/emailQueue', () => ({
  add: jest.fn(),
  getJob: jest.fn(),
  getJobCounts: jest.fn(),
  getFailed: jest.fn(),
}));

jest.mock('../queues/imageQueue', () => ({
  add: jest.fn(),
  getJob: jest.fn(),
  getJobCounts: jest.fn(),
  getFailed: jest.fn(),
}));

const request = require('supertest');
const app = require('../app');
const emailQueue = require('../queues/emailQueue');
const imageQueue = require('../queues/imageQueue');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/jobs/email', () => {
  it('rejects when required fields are missing', async () => {
    const res = await request(app).post('/api/jobs/email').send({});
    expect(res.status).toBe(400);
    expect(emailQueue.add).not.toHaveBeenCalled();
  });

  it('adds a job to the email queue with normal priority by default', async () => {
    emailQueue.add.mockResolvedValue({ id: '123' });

    const res = await request(app)
      .post('/api/jobs/email')
      .send({ to: 'a@b.com', subject: 'hi', body: 'hello' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ jobId: '123', queue: 'email' });
    expect(emailQueue.add).toHaveBeenCalledWith({ to: 'a@b.com', subject: 'hi', body: 'hello' }, { priority: 5 });
  });

  it('maps "high" priority to bull priority 1', async () => {
    emailQueue.add.mockResolvedValue({ id: '124' });

    await request(app)
      .post('/api/jobs/email')
      .send({ to: 'a@b.com', subject: 'hi', body: 'hello', priority: 'high' });

    expect(emailQueue.add).toHaveBeenCalledWith(expect.anything(), { priority: 1 });
  });
});

describe('POST /api/jobs/image', () => {
  it('rejects when imageUrl is missing', async () => {
    const res = await request(app).post('/api/jobs/image').send({});
    expect(res.status).toBe(400);
    expect(imageQueue.add).not.toHaveBeenCalled();
  });

  it('adds a job to the image queue', async () => {
    imageQueue.add.mockResolvedValue({ id: '55' });

    const res = await request(app).post('/api/jobs/image').send({ imageUrl: 'http://x/img.jpg' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ jobId: '55', queue: 'image' });
  });
});

describe('GET /api/jobs/:queueName/:id', () => {
  it('returns 404 when the job does not exist', async () => {
    emailQueue.getJob.mockResolvedValue(null);
    const res = await request(app).get('/api/jobs/email/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('returns job status when it exists', async () => {
    const fakeJob = {
      id: '1',
      data: { to: 'a@b.com' },
      attemptsMade: 1,
      failedReason: null,
      returnvalue: { sentAt: 'now' },
      getState: jest.fn().mockResolvedValue('completed'),
      progress: jest.fn().mockResolvedValue(100),
    };
    emailQueue.getJob.mockResolvedValue(fakeJob);

    const res = await request(app).get('/api/jobs/email/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      state: 'completed',
      progress: 100,
      attemptsMade: 1,
      failedReason: null,
      result: { sentAt: 'now' },
      data: { to: 'a@b.com' },
    });
  });

  it('returns 400 for an unknown queue name', async () => {
    const res = await request(app).get('/api/jobs/not-a-real-queue/1');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/jobs/:queueName/stats', () => {
  it('returns job counts for the queue', async () => {
    emailQueue.getJobCounts.mockResolvedValue({ waiting: 2, active: 1, completed: 10, failed: 0 });

    const res = await request(app).get('/api/jobs/email/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ queue: 'email', counts: { waiting: 2, active: 1, completed: 10, failed: 0 } });
  });
});

describe('GET /api/jobs/:queueName/failed', () => {
  it('returns a summary of failed jobs', async () => {
    imageQueue.getFailed.mockResolvedValue([
      { id: '9', data: { imageUrl: 'x.jpg' }, attemptsMade: 3, failedReason: 'boom' },
    ]);

    const res = await request(app).get('/api/jobs/image/failed');

    expect(res.status).toBe(200);
    expect(res.body.failed).toEqual([{ id: '9', data: { imageUrl: 'x.jpg' }, attemptsMade: 3, failedReason: 'boom' }]);
  });
});
