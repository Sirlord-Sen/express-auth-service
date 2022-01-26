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
exports.Connection = void 0;
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("config"));
const logger_util_1 = require("../utils/logger.util");
const { type, host, port, username, password, database, synchronize, } = config_1.default.get('db');
const Connection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, typeorm_1.createConnection)({
            type,
            host,
            port,
            username,
            password,
            database,
            synchronize,
            entities: ["src/user/entity/**/*.ts", "src/auth/entity/**/*.ts"]
        });
        logger_util_1.Logger.info("Database connected successfully");
    }
    catch (err) {
        logger_util_1.Logger.error(err);
    }
});
exports.Connection = Connection;
//# sourceMappingURL=typeorm.config.js.map