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
exports.healthCheckHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
const healthCheckHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webhookPath = req.webhookPath;
        const pingResponse = yield axios_1.default.get(webhookPath, { timeout: 2000 });
        res.status(200).json({
            status: 'UP',
            service: 'order_producer',
            targetApiReachable: pingResponse.status >= 200 && pingResponse.status < 400,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        logger_1.logger.error(` Health check failed: ${err.message}`);
        res.status(500).json({
            status: 'DOWN',
            service: 'order_producer',
            error: err.message,
            timestamp: new Date().toISOString(),
        });
    }
});
exports.healthCheckHandler = healthCheckHandler;
