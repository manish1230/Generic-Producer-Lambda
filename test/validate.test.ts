import { OrderValidator } from '../services/validate';
import { SourceOrderData } from '../models/sourceDataModel';

describe('OrderValidator', () => {
  const validRecord: SourceOrderData = {
    orderId: 'ORD123',
    orderDate: '07/06/2025',
    customerId: 'CUST001',
    storeId: 101,
    items: [
      {
        sku: 'ABC123',
        quantity: 2,
        unitPrice: 50,
        discountAmount: 5
      }
    ],
    paymentMethod: 'CARD',
    totalAmount: 90,
    status: 'NEW',
    shippingAddress: {
      street: '123 Main St',
      city: 'Town',
      state: 'State',
      zipCode: '123456',
      country: 'IN'
    },
    notes: 'Urgent'
  };

  it('should pass validation for valid record', () => {
    expect(() => OrderValidator.validate(validRecord)).not.toThrow();
  });

  it('should throw error for missing orderId', () => {
    const invalid = { ...validRecord, orderId: '' };
    expect(() => OrderValidator.validate(invalid)).toThrow(/orderId/);
  });

  it('should throw error for invalid date format', () => {
    const invalid = { ...validRecord, orderDate: '2025-07-06' };
    expect(() => OrderValidator.validate(invalid)).toThrow(/orderDate/);
  });

  it('should throw error for negative unitPrice', () => {
    const invalid = {
      ...validRecord,
      items: [{ ...validRecord.items[0], unitPrice: -1 }]
    };
    expect(() => OrderValidator.validate(invalid)).toThrow(/unitPrice/);
  });

  it('should throw error if shipping address field is missing', () => {
   const invalid = {
  ...validRecord,
  shippingAddress: {
    ...validRecord.shippingAddress!,
    city: '' // just making city invalid
  }
};

    expect(() => OrderValidator.validate(invalid)).toThrow(/city/);
  });
});
