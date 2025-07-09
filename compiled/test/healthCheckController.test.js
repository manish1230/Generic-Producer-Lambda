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
const healthCheckController_1 = require("../controllers/healthCheckController");
// Mocks
jest.mock('axios');
jest.mock('../utils/logger');
const mockedAxios = axios_1.default;
describe('healthCheckHandler', () => {
    const app = (0, express_1.default)();
    // Add webhookPath to request and route
    app.use((req, res, next) => {
        req.webhookPath = 'https://webhook.site/test';
        next();
    });
    app.get('/healthCheck', healthCheckController_1.healthCheckHandler);
    it('should return 200 if webhook is reachable', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockResolvedValueOnce({
            status: 200,
            data: {},
            statusText: 'OK',
            headers: {},
            config: { url: 'https://webhook.site/test' },
        });
        const res = yield (0, supertest_1.default)(app).get('/healthCheck');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('UP');
        expect(res.body.service).toBe('order_producer');
        expect(res.body.targetApiReachable).toBe(true);
    }));
    it('should return 500 if webhook is unreachable', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
        const res = yield (0, supertest_1.default)(app).get('/healthCheck');
        expect(res.status).toBe(500);
        expect(res.body.status).toBe('DOWN');
        expect(res.body.error).toBe('Network error');
    }));
});
