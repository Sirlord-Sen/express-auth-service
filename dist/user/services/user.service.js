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
exports.UserService = void 0;
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repository/user.repository");
class UserService {
    // public logger = new Logger()
    constructor() {
        this.userRepository = (0, typeorm_1.getConnection)().getCustomRepository(user_repository_1.UserRepository);
    }
    signup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = user;
                const saved = yield this.userRepository.save(post);
                // delete saved.password
                return saved;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map