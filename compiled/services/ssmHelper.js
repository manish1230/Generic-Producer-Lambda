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
exports.WebhookFetcher = void 0;
const client_ssm_1 = require("@aws-sdk/client-ssm");
class WebhookFetcher {
    static getUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const command = new client_ssm_1.GetParameterCommand({
                    Name: "WEBHOOK_PATH",
                    WithDecryption: false
                });
                const response = yield this.client.send(command);
                if (!((_a = response.Parameter) === null || _a === void 0 ? void 0 : _a.Value)) {
                    throw new Error("WEBHOOK_PATH is missing or empty");
                }
                return response.Parameter.Value;
            }
            catch (error) {
                console.error("Error fetching WEBHOOK_PATH:", error);
                throw new Error("Could not fetch webhook URL");
            }
        });
    }
}
exports.WebhookFetcher = WebhookFetcher;
WebhookFetcher.client = new client_ssm_1.SSMClient({ region: "ap-south-1" });
