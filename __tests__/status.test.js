const request = require('supertest');
const app = require('../src/app');

test('GET /status return ok', async () => {
    const res = await request(app).get('/status');

    expect(res.status).toBe(200);
    expect(res.text).toBe('ok');
})