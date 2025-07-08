"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../services/validate");
describe('OrderValidator', () => {
    const validRecord = {
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
        expect(() => validate_1.OrderValidator.validate(validRecord)).not.toThrow();
    });
    it('should throw error for missing orderId', () => {
        const invalid = Object.assign(Object.assign({}, validRecord), { orderId: '' });
        expect(() => validate_1.OrderValidator.validate(invalid)).toThrow(/orderId/);
    });
    it('should throw error for invalid date format', () => {
        const invalid = Object.assign(Object.assign({}, validRecord), { orderDate: '2025-07-06' });
        expect(() => validate_1.OrderValidator.validate(invalid)).toThrow(/orderDate/);
    });
    it('should throw error for negative unitPrice', () => {
        const invalid = Object.assign(Object.assign({}, validRecord), { items: [Object.assign(Object.assign({}, validRecord.items[0]), { unitPrice: -1 })] });
        expect(() => validate_1.OrderValidator.validate(invalid)).toThrow(/unitPrice/);
    });
    it('should throw error if shipping address field is missing', () => {
        const invalid = Object.assign(Object.assign({}, validRecord), { shippingAddress: Object.assign(Object.assign({}, validRecord.shippingAddress), { city: '' // just making city invalid
             }) });
        expect(() => validate_1.OrderValidator.validate(invalid)).toThrow(/city/);
    });
});
