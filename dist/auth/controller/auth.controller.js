"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const response_middleware_1 = require("../../common/middlewares/response.middleware");
const user_dto_1 = require("../../user/dto/user.dto");
const user_service_1 = require("../../user/services/user.service");
const auth_service_1 = require("../services/auth.service");
let UserController = class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.authService = new auth_service_1.AuthService();
    }
    post(body, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedUSer = yield this.userService.signup(body);
                return new response_middleware_1.SuccessResponse('success', savedUSer).send(res);
            }
            catch (err) {
                res.json(yield err);
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
], UserController.prototype, "post", null);
UserController = __decorate([
    (0, routing_controllers_1.JsonController)('/api/auth'),
    __metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=auth.controller.js.map