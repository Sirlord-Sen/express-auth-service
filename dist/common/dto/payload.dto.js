"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadDto = void 0;
const class_validator_1 = require("class-validator");
class PayloadDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "program", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "version", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "release", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "datetime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PayloadDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "message", void 0);
exports.PayloadDto = PayloadDto;
//# sourceMappingURL=payload.dto.js.map