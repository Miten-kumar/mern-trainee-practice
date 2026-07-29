const request = require('supertest');
const app = require('../app');

describe('GET /api/images', () => {
  it('returns a list of images', async () => {
    const res = await request(app).get('/api/images');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.images)).toBe(true);
    expect(res.body.images.length).toBeGreaterThan(0);
  });

  it('every image has the fields the frontend needs', async () => {
    const res = await request(app).get('/api/images');
    res.body.images.forEach((img) => {
      expect(img).toHaveProperty('id');
      expect(img).toHaveProperty('picsumId');
      expect(img).toHaveProperty('width');
      expect(img).toHaveProperty('height');
      expect(img).toHaveProperty('alt');
      expect(img).toHaveProperty('dominantColor');
    });
  });
});

describe('GET /api/images/:id', () => {
  it('returns a single image by id', async () => {
    const res = await request(app).get('/api/images/1');
    expect(res.status).toBe(200);
    expect(res.body.image.id).toBe(1);
  });

  it('returns 404 for an id that does not exist', async () => {
    const res = await request(app).get('/api/images/9999');
    expect(res.status).toBe(404);
  });
});
