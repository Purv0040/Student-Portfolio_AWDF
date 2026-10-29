/**
 * tests/health.test.js
 *
 * Integration smoke-test for the Express app's public endpoints.
 * Uses supertest to send HTTP requests without binding a real port,
 * so no MongoDB connection is required for these tests.
 */

import request from 'supertest';
import app from '../src/app.js';

describe('GET /health', () => {
  test('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Unknown routes', () => {
  test('returns 404 for an undefined route', async () => {
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.statusCode).toBe(404);
  });
});

