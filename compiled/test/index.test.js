"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const validate_1 = require("../services/validate");
const transform_1 = require("../services/transform");
const axios_1 = __importDefault(require("axios"));
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
        validate_1.OrderValidator.validate.mockImplementation(() => { });
        // @ts-ignore
        transform_1.OrderTransformer.transform.mockReturnValue({ mock: "data" });
        // @ts-ignore
        axios_1.default.post.mockResolvedValue({ status: 200 });
        // @ts-ignore
        axios_1.default.get.mockResolvedValue({ status: 200 });
    });
    it('should return 200 for valid publish', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).post('/publish').send(validRecord);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Published successfully' });
    }));
    it('should return 400 for invalid publish', () => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        validate_1.OrderValidator.validate.mockImplementationOnce(() => {
            throw new Error("Invalid input");
        });
        const res = yield (0, supertest_1.default)(index_1.default).post('/publish').send({});
        expect(res.status).toBe(400);
        expect(res.text).toBe("Invalid input");
    }));
    it('should return 200 on healthCheck if target is up', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get('/healthCheck');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('UP');
    }));
    it('should return 500 on healthCheck if target is down', () => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        axios_1.default.get.mockRejectedValueOnce(new Error("Down"));
        const res = yield (0, supertest_1.default)(index_1.default).get('/healthCheck');
        expect(res.status).toBe(500);
        expect(res.body.status).toBe('DOWN');
    }));
    it('should return 404 for unknown route', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index_1.default).get('/invalid-route');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Route not found');
    }));
});
