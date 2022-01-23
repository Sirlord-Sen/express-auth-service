"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const morgan = require("morgan");
const logger_util_1 = require("../utils/logger.util");
const stream = {
    write: (message) => logger_util_1.Logger.http(message),
};
const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};
const morganMiddleware = morgan('short', { stream, skip });
exports.default = morganMiddleware;
//# sourceMappingURL=morgan.middleware.js.map