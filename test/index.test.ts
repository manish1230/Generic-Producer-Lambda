
import request from 'supertest';
import app from '../index';
import { OrderValidator } from '../services/validate';
import { OrderTransformer } from '../services/transform';
import axios from 'axios';

jest.mock('../services/validate');
jest.mock('../services/transform');
jest.mock('axios');

describe('Generic Producer Express App', () => {
  const validRecord = {
    orderId: "ORD001",
    orderDate: "07/06/2025",
    customerId: "CUST123",
    storeId: 1,
    items: [{ sku: "SKU1", quantity: 2, unitPrice: 100, discountAmount: 10 }],
    paymentMethod: "CARD",
    totalAmount: 180,
    status: "NEW",
    shippingAddress: {
      street: "123 Street",
      city: "City",
      state: "State",
      zipCode: "123456",
      country: "IN"
    },
    notes: "Test order"
  };

  beforeEach(() => {
    // @ts-ignore
    OrderValidator.validate.mockImplementation(() => {});
    // @ts-ignore
    OrderTransformer.transform.mockReturnValue({ mock: "data" });
    // @ts-ignore
    axios.post.mockResolvedValue({ status: 200 });
    // @ts-ignore
    axios.get.mockResolvedValue({ status: 200 });
  });

  it('should return 200 for valid publish', async () => {
    const res = await request(app).post('/publish').send(validRecord);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Published successfully' });
  });

  it('should return 400 for invalid publish', async () => {
    // @ts-ignore
    OrderValidator.validate.mockImplementationOnce(() => {
      throw new Error("Invalid input");
    });

    const res = await request(app).post('/publish').send({});
    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid input");
  });

  it('should return 200 on healthCheck if target is up', async () => {
    const res = await request(app).get('/healthCheck');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('should return 500 on healthCheck if target is down', async () => {
    // @ts-ignore
    axios.get.mockRejectedValueOnce(new Error("Down"));
    const res = await request(app).get('/healthCheck');
    expect(res.status).toBe(500);
    expect(res.body.status).toBe('DOWN');
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/invalid-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });
});
