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
exports.publishHandler = void 0;
const axios_1 = __importDefault(require("axios"));
const validate_1 = require("../services/validate");
const transform_1 = require("../services/transform");
const logger_1 = require("../utils/logger");
const publishHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = req.body;
        validate_1.OrderValidator.validate(record);
        const transformed = transform_1.OrderTransformer.transform(record);
        const webhookPath = req.webhookPath;
        yield axios_1.default.post(webhookPath, transformed, {
            headers: { 'Content-Type': 'application/json' }
        });
        res.status(200).json({ message: 'Published successfully' });
    }
    catch (err) {
        logger_1.logger.error(` Publish error: ${err.message}`);
        res.status(400).send(err.message);
    }
});
exports.publishHandler = publishHandler;
