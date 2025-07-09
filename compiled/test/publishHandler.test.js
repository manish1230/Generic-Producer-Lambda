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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const publishController_1 = require("../controllers/publishController");
const validate_1 = require("../services/validate");
const transform_1 = require("../services/transform");
jest.mock('axios');
jest.mock('../services/validate');
jest.mock('../services/transform');
jest.mock('../utils/logger');
const mockedAxios = axios_1.default;
const mockedValidate = validate_1.OrderValidator.validate;
const mockedTransform = transform_1.OrderTransformer.transform;
describe('publishHandler', () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Add webhookPath middleware
    app.use((req, res, next) => {
        req.webhookPath = 'https://webhook.site/test';
        next();
    });
    app.post('/publish', publishController_1.publishHandler);
    const sampleRecord = {
        orderId: '123',
        items: [{ sku: 'A1', quantity: 1, unitPrice: 100 }],
        status: 'NEW',
    };
    it('should return 200 for valid publish', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedValidate.mockImplementation(() => { });
        mockedTransform.mockReturnValue({ transformed: true });
        mockedAxios.get.mockResolvedValueOnce({
            status: 200,
            data: {},
            statusText: 'OK',
            headers: {},
            config: { url: 'https://webhook.site/test' },
        });
        const res = yield (0, supertest_1.default)(app).post('/publish').send(sampleRecord);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Published successfully');
    }));
    it('should return 400 for validation error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedValidate.mockImplementation(() => {
            throw new Error('Invalid input');
        });
        const res = yield (0, supertest_1.default)(app).post('/publish').send({});
        expect(res.status).toBe(400);
        expect(res.text).toBe('Invalid input');
    }));
});
