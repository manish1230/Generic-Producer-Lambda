"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_serverless_express_1 = __importDefault(require("aws-serverless-express"));
const index_1 = __importDefault(require("./index"));
const server = aws_serverless_express_1.default.createServer(index_1.default);
const handler = (event, context) => {
    return aws_serverless_express_1.default.proxy(server, event, context);
};
exports.handler = handler;
// import { APIGatewayProxyHandler } from 'aws-lambda';
// import serverlessExpress from '@codegenie/serverless-express';
// import app from './index'; // make sure app.ts exports your express app
// export const handler: APIGatewayProxyHandler = serverlessExpress({ app });
