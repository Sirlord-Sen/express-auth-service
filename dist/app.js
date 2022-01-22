"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const dotenv = require("dotenv");
const config = require("config");
const server_1 = require("./server");
const logger_util_1 = require("./common/utils/logger.util");
class Application {
    constructor() {
        dotenv.config();
        this.express = new server_1.ExpressConfig();
        this.start();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const port = config.get('server.port');
            const debugPort = config.get('ports.debug');
            this.express.app.listen(port, () => {
                logger_util_1.Logger.info(`
            ------------
            Server Started!
            Http: http://localhost:${port}
            -------------
          `);
            });
        });
    }
}
exports.Application = Application;
//# sourceMappingURL=app.js.map