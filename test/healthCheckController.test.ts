import request from 'supertest';
import express from 'express';
import axios from 'axios';
import { healthCheckHandler } from '../controllers/healthCheckController';
import { logger } from '../utils/logger';

// Mocks
jest.mock('axios');
jest.mock('../utils/logger');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('healthCheckHandler', () => {
  const app = express();

  // Add webhookPath to request and route
  app.use((req, res, next) => {
    (req as any).webhookPath = 'https://webhook.site/test';
    next();
  });
  app.get('/healthCheck', healthCheckHandler);

  it('should return 200 if webhook is reachable', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: {},
      statusText: 'OK',
      headers: {},
      config: {url: 'https://webhook.site/test'},
    });

    const res = await request(app).get('/healthCheck');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.service).toBe('order_producer');
    expect(res.body.targetApiReachable).toBe(true);
  });

  it('should return 500 if webhook is unreachable', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const res = await request(app).get('/healthCheck');

    expect(res.status).toBe(500);
    expect(res.body.status).toBe('DOWN');
    expect(res.body.error).toBe('Network error');
  });
});
