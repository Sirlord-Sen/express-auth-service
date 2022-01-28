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
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const user_repository_1 = require("../repository/user.repository");
const errorResponse_middleware_1 = require("../../common/middlewares/errorResponse.middleware");
class UserService {
    constructor() {
        this.userRepository = (0, typeorm_1.getCustomRepository)(user_repository_1.UserRepository);
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, firstname, surname, email, password } = data;
                password = yield this.authService.hashPassword(password);
                const hashedPassword = password;
                console.log(data);
                const newUser = yield this.userRepository.createUser({ username, firstname, surname, email, password: hashedPassword });
                const savedUser = (0, lodash_1.pick)(newUser, ["id", "username", "email", "firstname", "surname"]);
                return savedUser;
            }
            catch (err) {
                throw err;
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findOneOrFail({ where: query });
            }
            catch (err) {
                throw new errorResponse_middleware_1.NotFoundError("User not found").send();
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map