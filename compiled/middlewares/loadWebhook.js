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
exports.loadWebhookUrlMiddleware = void 0;
const ssmHelper_1 = require("../services/ssmHelper");
const logger_1 = require("../utils/logger");
let webhookPath = "";
const loadWebhookUrlMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!webhookPath) {
            webhookPath = yield ssmHelper_1.WebhookFetcher.getUrl();
            logger_1.logger.info(`✅ Webhook path loaded from SSM: ${webhookPath}`);
        }
        // Attach to request for downstream routes
        req.webhookPath = webhookPath;
        next();
    }
    catch (err) {
        logger_1.logger.error(`❌ Failed to load webhookPath from SSM: ${err.message}`);
        res.status(500).json({ error: "Failed to load configuration from SSM" });
    }
});
exports.loadWebhookUrlMiddleware = loadWebhookUrlMiddleware;
