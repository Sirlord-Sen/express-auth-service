"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomErrorHandler = void 0;
const routing_controllers_1 = require("routing-controllers");
const errorResponse_middleware_1 = require("./errorResponse.middleware");
const class_validator_1 = require("class-validator");
let CustomErrorHandler = class CustomErrorHandler {
    error(error, request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error.errors[0] instanceof class_validator_1.ValidationError) {
                let message = '';
                for (let i in error.errors[0].constraints) {
                    message = error.errors[0].constraints[i];
                }
                response.json(new errorResponse_middleware_1.BadRequestError(message).send());
            }
            next();
        });
    }
};
CustomErrorHandler = __decorate([
    (0, routing_controllers_1.Middleware)({ type: 'after' })
], CustomErrorHandler);
exports.CustomErrorHandler = CustomErrorHandler;
//# sourceMappingURL=error.middleware.js.map