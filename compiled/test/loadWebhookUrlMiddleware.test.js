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
Object.defineProperty(exports, "__esModule", { value: true });
const loadWebhook_1 = require("../middlewares/loadWebhook");
const ssmHelper_1 = require("../services/ssmHelper");
jest.mock('../services/ssmHelper');
jest.mock('../utils/logger');
const mockedGetUrl = ssmHelper_1.WebhookFetcher.getUrl;
describe('loadWebhookUrlMiddleware', () => {
    const originalModule = jest.requireActual('../middlewares/loadWebhook');
    let req;
    let res;
    let next;
    beforeEach(() => {
        originalModule.webhookPath = '';
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });
    it('should fetch and attach webhookPath on first call', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedGetUrl.mockResolvedValueOnce('https://webhook.site/test');
        yield (0, loadWebhook_1.loadWebhookUrlMiddleware)(req, res, next);
        expect(mockedGetUrl).toHaveBeenCalled();
        expect(req.webhookPath).toBe('https://webhook.site/test');
        expect(next).toHaveBeenCalled();
    }));
});
