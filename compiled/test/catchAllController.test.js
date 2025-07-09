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
const catchAllUnmatchedRoute_1 = require("../controllers/catchAllUnmatchedRoute");
describe('catchAllController', () => {
    let app;
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use(catchAllUnmatchedRoute_1.catchAllController);
    });
    it('should return 404 with appropriate error structure for unknown route', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/non-existent-route');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Route not found');
        expect(response.body).toHaveProperty('path', '/non-existent-route');
        expect(response.body).toHaveProperty('method', 'GET');
        expect(response.body).toHaveProperty('timestamp');
        expect(new Date(response.body.timestamp).toString()).not.toBe('Invalid Date');
    }));
    it('should return correct method for POST requests too', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/random-path');
        expect(response.status).toBe(404);
        expect(response.body.method).toBe('POST');
        expect(response.body.path).toBe('/random-path');
    }));
});
