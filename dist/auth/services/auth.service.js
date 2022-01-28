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
const argon2_1 = __importDefault(require("argon2"));
const user_service_1 = __importDefault(require("../../user/services/user.service"));
const errorResponse_middleware_1 = require("../../common/middlewares/errorResponse.middleware");
class AuthService {
    constructor() {
        this.userService = new user_service_1.default();
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield argon2_1.default.hash(password);
            }
            catch (err) {
                throw new errorResponse_middleware_1.InternalError('Argon2 Not Hashing Password').send();
            }
        });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = body;
                const user = yield this.userService.findOne({ email });
                // return user
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map