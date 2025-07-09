import request from 'supertest';
import express from 'express';
import axios from 'axios';
import { publishHandler } from '../controllers/publishController';
import { OrderValidator } from '../services/validate';
import { OrderTransformer } from '../services/transform';
import { logger } from '../utils/logger';

jest.mock('axios');
jest.mock('../services/validate');
jest.mock('../services/transform');
jest.mock('../utils/logger');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedValidate = OrderValidator.validate as jest.Mock;
const mockedTransform = OrderTransformer.transform as jest.Mock;

describe('publishHandler', () => {
  const app = express();
  app.use(express.json());

  // Add webhookPath middleware
  app.use((req, res, next) => {
    (req as any).webhookPath = 'https://webhook.site/test';
    next();
  });
  app.post('/publish', publishHandler);

  const sampleRecord = {
    orderId: '123',
    items: [{ sku: 'A1', quantity: 1, unitPrice: 100 }],
    status: 'NEW',
  };

  it('should return 200 for valid publish', async () => {
    mockedValidate.mockImplementation(() => {});
    mockedTransform.mockReturnValue({ transformed: true });
     mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: {},
      statusText: 'OK',
      headers: {},
      config: {url: 'https://webhook.site/test'},
    });

    const res = await request(app).post('/publish').send(sampleRecord);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Published successfully');
  });

  it('should return 400 for validation error', async () => {
    mockedValidate.mockImplementation(() => {
      throw new Error('Invalid input');
    });

    const res = await request(app).post('/publish').send({});

    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid input');
  });
});
