const request = require('supertest');
const app = require('./index');

describe('Health Check API', () => {
    it('responds with 200 OK', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
    });
});
