"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const typeorm_1 = require("typeorm");
const config = require("config");
const logger_util_1 = require("../utils/logger.util");
const { type, host, port, username, password, database, synchronize, } = config.get('db');
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