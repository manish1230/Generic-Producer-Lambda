"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import axios from 'axios';
const healthCheckController_1 = require("./controllers/healthCheckController");
const publishController_1 = require("./controllers/publishController");
const loadWebhook_1 = require("./middlewares/loadWebhook");
const catchAllUnmatchedRoute_1 = require("./controllers/catchAllUnmatchedRoute");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//middleware to load webhook site url
app.use(loadWebhook_1.loadWebhookUrlMiddleware);
//endpoints
app.get('/healthCheck', healthCheckController_1.healthCheckHandler);
app.post('/publish', publishController_1.publishHandler);
// catch all unmatched route
app.use(catchAllUnmatchedRoute_1.catchAllController);
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
exports.default = app;
