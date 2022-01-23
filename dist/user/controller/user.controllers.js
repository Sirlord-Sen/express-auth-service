"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const user_service_1 = require("../services/user.service");
let UserController = class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    post(user) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)('/'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "post", null);
UserController = __decorate([
    (0, routing_controllers_1.JsonController)('/api/users'),
    __metadata("design:paramtypes", [])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controllers.js.map