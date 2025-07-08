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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
;
const validate_1 = require("./services/validate");
const transform_1 = require("./services/transform");
const ssmHelper_1 = require("./services/ssmHelper");
// import dotenv from 'dotenv';
// dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
let webhookPath = "";
// ✅ Middleware to load webhook URL once and cache it
const loadWebhookUrlMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!webhookPath) {
            webhookPath = yield ssmHelper_1.WebhookFetcher.getUrl();
            console.log("✅ Webhook path loaded from SSM:", webhookPath);
        }
        next();
    }
    catch (err) {
        console.error("❌ Failed to load webhookPath from SSM:", err.message);
        res.status(500).json({ error: "Failed to load configuration from SSM" });
    }
});
// ✅ Attach middleware globally
app.use(loadWebhookUrlMiddleware);

// POST route
app.post('/publish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = req.body;
        //validation
        validate_1.OrderValidator.validate(record);
        // transformation
        const transformed = transform_1.OrderTransformer.transform(record);
        ;
        yield axios_1.default.post(webhookPath, transformed, {
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(200).json({ message: 'Published successfully' });
    }
    catch (err) {
        console.error('Error:', err.message);
        res.status(400).send(err.message);
    }
}));
// Health check route
app.get('/healthCheck', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check connectivity to downstream API
        const pingResponse = yield axios_1.default.get(webhookPath, {
            timeout: 2000, // Fail fast if downstream is unresponsive
        });
        res.status(200).json({
            status: 'UP',
            service: 'order_producer',
            targetApiReachable: pingResponse.status >= 200 && pingResponse.status < 400,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'DOWN',
            service: 'order_producer',
            error: err.message,
            timestamp: new Date().toISOString(),
        });
    }
}));
// catch all unmatched route
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
});
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
exports.default = app;
