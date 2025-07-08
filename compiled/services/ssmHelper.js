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
//   import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
// const ssmClient = new SSMClient({ region: "ap-south-1" });  
// export async function getWebhookUrl(): Promise<string> {  
//   const command = new GetParameterCommand({
//     Name: "WEBHOOK_PATH", // SSM parameter name
//     WithDecryption: false
//   });
//     try {
//     const response = await ssmClient.send(command);
//     if (!response.Parameter || !response.Parameter.Value) {
//       throw new Error("WEBHOOK_PATH parameter is missing or empty in Parameter Store");
//     }
//    // console.log(response.Parameter.Value);
//     return response.Parameter.Value;
//   } catch (err) {
//     console.error("Failed to fetch WEBHOOK_PATH from SSM:", err);
//     throw new Error("Failed to load webhook URL from Parameter Store");
//   }
// }
// //add try catch
