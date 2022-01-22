"use strict";
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
            const post = user;
            const saved = yield this.userRepository.save(post);
            return ({
                "message": "success",
                "payload": {
                    "name": saved.firstname,
                    "email": saved.email
                }
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map