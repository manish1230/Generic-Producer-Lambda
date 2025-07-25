"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transform_1 = require("../services/transform");
describe('OrderTransformer', () => {
    it('should transform a valid record correctly', () => {
        const input = {
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
        const result = transform_1.OrderTransformer.transform(input);
        expect(result.order.id).toBe('ORD123');
        expect(result.order.status).toBe('new');
        expect(result.items[0].price.final).toBeCloseTo(90); // (50 - 5) * 2
        expect(result.metadata.source).toBe('order_producer');
    });
});
