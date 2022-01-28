"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isProduction = process.env.NODE_ENV === "production";
const cookiesConfig = {
    httpOnly: true,
    secure: isProduction ? true : false,
    // Add sameSite & domain for prod
};
exports.default = cookiesConfig;
//# sourceMappingURL=cookies.config.js.map