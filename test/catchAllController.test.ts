import request from 'supertest';
import express from 'express';
import { catchAllController } from '../controllers/catchAllUnmatchedRoute';

describe('catchAllController', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(catchAllController);
  });

  it('should return 404 with appropriate error structure for unknown route', async () => {
    const response = await request(app).get('/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Route not found');
    expect(response.body).toHaveProperty('path', '/non-existent-route');
    expect(response.body).toHaveProperty('method', 'GET');
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('should return correct method for POST requests too', async () => {
    const response = await request(app).post('/random-path');

    expect(response.status).toBe(404);
    expect(response.body.method).toBe('POST');
    expect(response.body.path).toBe('/random-path');
  });
});
