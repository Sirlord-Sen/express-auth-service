"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const logger_util_1 = require("../utils/logger.util");
const stream = {
    write: (message) => logger_util_1.Logger.http(message),
};
const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};
const morganMiddleware = (0, morgan_1.default)('short', { stream, skip });
exports.default = morganMiddleware;
//# sourceMappingURL=morgan.middleware.js.map