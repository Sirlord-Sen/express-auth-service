"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ExpressConfig = void 0;
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routing_controllers_1 = require("routing-controllers");
const morgan_middleware_1 = __importDefault(require("./common/middlewares/morgan.middleware"));
class ExpressConfig {
    constructor() {
        this.app = (0, express_1.default)();
        this.middlerwares();
        this.setupControllers();
    }
    middlerwares() {
        this.app.use((0, cors_1.default)());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(morgan_middleware_1.default);
    }
    setupControllers() {
        return __awaiter(this, void 0, void 0, function* () {
            const authControllers = path.resolve(__dirname, "auth/controller/**/*.ts");
            const userControllers = path.resolve(__dirname, "user/controller/**/*.ts");
            (0, routing_controllers_1.useExpressServer)(this.app, { controllers: [authControllers, userControllers], classTransformer: true, validation: true });
        });
    }
}
exports.ExpressConfig = ExpressConfig;
//# sourceMappingURL=server.js.map