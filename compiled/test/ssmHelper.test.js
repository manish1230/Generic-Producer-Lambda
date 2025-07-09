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
const ssmHelper_1 = require("../services/ssmHelper");
const client_ssm_1 = require("@aws-sdk/client-ssm");
// 👇 Mock GetParameterCommand (for verification only)
jest.mock('@aws-sdk/client-ssm', () => {
    const original = jest.requireActual('@aws-sdk/client-ssm');
    return Object.assign(Object.assign({}, original), { GetParameterCommand: jest.fn() });
});
// 👇 Mock SSMClient.prototype.send directly
const sendMock = jest.fn();
client_ssm_1.SSMClient.prototype.send = sendMock;
describe('getWebhookUrl (AWS SDK v3)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return webhook URL from SSM', () => __awaiter(void 0, void 0, void 0, function* () {
        sendMock.mockResolvedValueOnce({
            Parameter: { Value: 'https://webhook.site/abc123' }
        });
        const url = yield ssmHelper_1.WebhookFetcher.getUrl();
        expect(url).toBe('https://webhook.site/abc123');
        expect(client_ssm_1.GetParameterCommand).toHaveBeenCalledWith({
            Name: 'WEBHOOK_PATH',
            WithDecryption: false
        });
    }));
    it('should throw error if Parameter is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        sendMock.mockResolvedValueOnce({ Parameter: {} });
        yield expect(ssmHelper_1.WebhookFetcher.getUrl()).rejects.toThrow("Could not fetch webhook URL");
    }));
    it('should throw error if SSM call fails', () => __awaiter(void 0, void 0, void 0, function* () {
        sendMock.mockRejectedValueOnce(new Error('Could not fetch webhook URL'));
        yield expect(ssmHelper_1.WebhookFetcher.getUrl()).rejects.toThrow('Could not fetch webhook URL');
    }));
});
