"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressConfig = void 0;
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const routing_controllers_1 = require("routing-controllers");
const morgan_middleware_1 = require("./common/middlewares/morgan.middleware");
class ExpressConfig {
    constructor() {
        this.app = express();
        this.middlerwares();
        this.setupControllers();
    }
    middlerwares() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(morgan_middleware_1.default);
    }
    setupControllers() {
        return __awaiter(this, void 0, void 0, function* () {
            const authControllers = path.resolve(__dirname, "auth/controller/**/*.ts");
            const userControllers = path.resolve(__dirname, "user/controller/**/*.ts");
            (0, routing_controllers_1.useExpressServer)(this.app, { controllers: [authControllers, userControllers] });
        });
    }
}
exports.ExpressConfig = ExpressConfig;
//# sourceMappingURL=server.js.map