"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const response_middleware_1 = require("../../common/middlewares/response.middleware");
const user_dto_1 = require("../dto/user.dto");
const user_service_1 = __importDefault(require("../../user/services/user.service"));
let UserController = class UserController {
    constructor() {
        this.userService = new user_service_1.default();
    }
    Register(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.register(body);
                return new response_middleware_1.SuccessResponse('New User Created', { user: user }).send(res);
            }
            catch (err) {
                return err;
            }
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)('/register'),
    __param(0, (0, routing_controllers_1.Body)()),
    __param(1, (0, routing_controllers_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SignUpDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Register", null);
UserController = __decorate([
    (0, routing_controllers_1.Controller)('/api/user'),
    __metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controllers.js.map