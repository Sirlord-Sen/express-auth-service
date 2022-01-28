"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailureMsgResponse = exports.SuccessMsgResponse = exports.ConflictErrorResponse = exports.InternalErrorResponse = exports.BadRequestResponse = exports.ForbiddenResponse = exports.NotFoundResponse = exports.AuthFailureResponse = exports.SuccessResponse = void 0;
const lodash_1 = require("lodash");
// Helper code for the API consumer to understand the error and handle is accordingly
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["SUCCESS"] = "success";
    ResponseStatus["FAILURE"] = "fail";
    ResponseStatus["NOTFOUND"] = "NotFoundError";
    ResponseStatus["BADREQUEST"] = "BadRequestError";
})(ResponseStatus || (ResponseStatus = {}));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["SUCCESS"] = 200] = "SUCCESS";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
})(StatusCode || (StatusCode = {}));
class ApiResponse {
    constructor(status, code, message) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.program = 'stud-aid microservice';
        this.version = 'v1';
        this.release = '1.2.1';
        this.datetime = new Date();
        this.data = { user: null };
    }
    prepare(res, response) {
        res.status(this.code);
        return ApiResponse.sanitize(response);
    }
    send(res) {
        return this.prepare(res, this);
    }
    static sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        for (const i in clone)
            if (typeof clone[i] === 'undefined')
                delete clone[i];
        const output = (0, lodash_1.pick)(clone, ["program", "version", "release", "datetime", "status", "message", "data"]);
        return output;
    }
}
class SuccessResponse extends ApiResponse {
    constructor(message, data) {
        super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, message);
        this.data = data;
    }
    send(res) { return super.prepare(res, this); }
}
exports.SuccessResponse = SuccessResponse;
class AuthFailureResponse extends ApiResponse {
    constructor(message = 'Authentication Failure') {
        super(ResponseStatus.FAILURE, StatusCode.UNAUTHORIZED, message);
    }
}
exports.AuthFailureResponse = AuthFailureResponse;
class NotFoundResponse extends ApiResponse {
    constructor(message = 'Not Found') {
        super(ResponseStatus.NOTFOUND, StatusCode.NOT_FOUND, message);
    }
    send(res) {
        var _a;
        this.url = (_a = res.req) === null || _a === void 0 ? void 0 : _a.originalUrl;
        return super.prepare(res, this);
    }
}
exports.NotFoundResponse = NotFoundResponse;
class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
        super(ResponseStatus.FAILURE, StatusCode.FORBIDDEN, message);
    }
}
exports.ForbiddenResponse = ForbiddenResponse;
class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
        super(ResponseStatus.BADREQUEST, StatusCode.BAD_REQUEST, message);
    }
}
exports.BadRequestResponse = BadRequestResponse;
class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error') {
        super(ResponseStatus.FAILURE, StatusCode.INTERNAL_ERROR, message);
    }
}
exports.InternalErrorResponse = InternalErrorResponse;
class ConflictErrorResponse extends ApiResponse {
    constructor(message = 'Conflict Error') {
        super(ResponseStatus.FAILURE, StatusCode.CONFLICT, message);
    }
}
exports.ConflictErrorResponse = ConflictErrorResponse;
class SuccessMsgResponse extends ApiResponse {
    constructor(message) {
        super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, message);
    }
}
exports.SuccessMsgResponse = SuccessMsgResponse;
class FailureMsgResponse extends ApiResponse {
    constructor(message) {
        super(ResponseStatus.FAILURE, StatusCode.SUCCESS, message);
    }
}
exports.FailureMsgResponse = FailureMsgResponse;
//# sourceMappingURL=response.middleware.js.map