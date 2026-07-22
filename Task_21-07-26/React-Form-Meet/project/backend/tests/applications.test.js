const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const dataFile = path.join(__dirname, '..', 'data', 'applications.json');

// small helper with the required text fields, so each test doesn't
// have to repeat all of them
function baseFields(overrides = {}) {
  return {
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    dob: '2000-01-15',
    employmentStatus: 'unemployed',
    ...overrides,
  };
}

describe('POST /api/applications', () => {
  afterEach(() => {
    // clean up so tests don't pile up fake data on disk
    if (fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([]));
    }
  });

  it('rejects when required text fields are missing', async () => {
    const res = await request(app).post('/api/applications').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/missing required fields/i);
  });

  it('rejects when resume file is missing', async () => {
    const fields = baseFields();
    const res = await request(app)
      .post('/api/applications')
      .field('fullName', fields.fullName)
      .field('email', fields.email)
      .field('phone', fields.phone)
      .field('dob', fields.dob)
      .field('employmentStatus', fields.employmentStatus);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/resume file is required/i);
  });

  it('rejects a disallowed file type', async () => {
    const fields = baseFields();
    const res = await request(app)
      .post('/api/applications')
      .field('fullName', fields.fullName)
      .field('email', fields.email)
      .field('phone', fields.phone)
      .field('dob', fields.dob)
      .field('employmentStatus', fields.employmentStatus)
      .attach('resume', path.join(__dirname, 'fixtures', 'dummy.exe'));

    expect(res.status).toBe(400);
  });

  it('accepts a valid submission with a resume attached', async () => {
    const fields = baseFields();
    const res = await request(app)
      .post('/api/applications')
      .field('fullName', fields.fullName)
      .field('email', fields.email)
      .field('phone', fields.phone)
      .field('dob', fields.dob)
      .field('employmentStatus', fields.employmentStatus)
      .field('certifications', JSON.stringify([{ name: 'AWS Basics', year: 2023 }]))
      .attach('resume', path.join(__dirname, 'fixtures', 'dummy.pdf'));

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.message).toMatch(/submitted/i);
  });

  it('saves the submission to the data file', async () => {
    const fields = baseFields({ employmentStatus: 'employed', companyName: 'Acme', jobTitle: 'Dev' });
    await request(app)
      .post('/api/applications')
      .field('fullName', fields.fullName)
      .field('email', fields.email)
      .field('phone', fields.phone)
      .field('dob', fields.dob)
      .field('employmentStatus', fields.employmentStatus)
      .field('companyName', fields.companyName)
      .field('jobTitle', fields.jobTitle)
      .attach('resume', path.join(__dirname, 'fixtures', 'dummy.pdf'));

    const saved = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    expect(saved.length).toBe(1);
    expect(saved[0].fullName).toBe('Priya Sharma');
    expect(saved[0].companyName).toBe('Acme');
  });
});
