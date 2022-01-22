"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_config_1 = require("./common/config/typeorm.config");
const app_1 = require("./app");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, typeorm_config_1.Connection)();
        new app_1.Application;
    });
}
bootstrap();
//# sourceMappingURL=main.js.map