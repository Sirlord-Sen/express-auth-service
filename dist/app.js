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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const server_1 = require("./server");
const logger_util_1 = require("./utils/logger.util");
const config_1 = require("./config");
class Application {
    constructor() {
        this.express = new server_1.ExpressConfig();
        this.start();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const port = config_1.parsedEnv.PORT;
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