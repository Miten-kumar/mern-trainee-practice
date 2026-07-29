const request = require('supertest');
const app = require('../app');

describe('GET /api/search', () => {
  it('returns an empty array when there is no query', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(200);
    expect(res.body.results).toEqual([]);
  });

  it('returns matching items for a query', async () => {
    const res = await request(app).get('/api/search?q=script');
    expect(res.status).toBe(200);
    const names = res.body.results.map((r) => r.name);
    expect(names).toContain('JavaScript');
    expect(names).toContain('TypeScript');
  });

  it('is case insensitive', async () => {
    const res = await request(app).get('/api/search?q=REACT');
    const names = res.body.results.map((r) => r.name);
    expect(names).toContain('React');
  });

  it('returns an empty list when nothing matches', async () => {
    const res = await request(app).get('/api/search?q=zzzznotreal');
    expect(res.body.results).toEqual([]);
  });

  it('puts names that start with the query before names that just contain it', async () => {
    // "Go" starts with "go", "MongoDB" and "Django" just contain it
    const res = await request(app).get('/api/search?q=go');
    const names = res.body.results.map((r) => r.name);
    expect(names[0]).toBe('Go');
  });

  it('caps results at 8', async () => {
    // "a" matches a lot of entries in the dataset
    const res = await request(app).get('/api/search?q=a');
    expect(res.body.results.length).toBeLessThanOrEqual(8);
  });
});
