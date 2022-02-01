import { response, Response } from 'express';
import { pick } from 'lodash';
import { UserPayloadDto } from '../modules/user/dto/user.dto';
import { PayloadDto } from './util-types';

// Helper code for the API consumer to understand the error and handle is accordingly
enum ResponseStatus {
    SUCCESS = 'Success',
    FAILURE = 'Fail',
    NOTFOUND = 'NotFoundError',
    BADREQUEST = 'BadRequestError',
    CONFLICT = 'ConflictError',
    UNAUTHORIZED = 'UnauthorizedError',
    FORBIDDEN = 'ForbiddenError'
}

enum StatusCode {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
    CONFLICT = 409
}


abstract class ApiResponse {
    program: string
    version: string
    release: string
    datetime: Date
    data: any
    constructor(
        public status: ResponseStatus,
        public code: StatusCode,
        public message: string,
    ) {
        this.program = 'stud-aid microservice'
        this.version = 'v1'
        this.release = '1.2.1'
        this.datetime = new Date()
        this.data = {user: null}
    }


    protected prepare<T extends ApiResponse>(res: Response, response: T): PayloadDto {
        res.status(this.code)
        return ApiResponse.sanitize(response)   
    }

    public send(res: Response): PayloadDto {
        return this.prepare<ApiResponse>(res, this);
    }

    private static sanitize<T extends ApiResponse>(response: T): PayloadDto {
        const clone: T = {} as T;
        Object.assign(clone, response);
        
        for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
        const output = pick(clone, ["program", "version", "release", "datetime", "status", "message", "data"])
        return output;
    }
}

export class SuccessResponse<T> extends ApiResponse{
    constructor(message: string, public data: T) {
        super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, message);
    }
    send(): UserPayloadDto { return super.prepare<SuccessResponse<T>>(response, this); }
}

export class UnauthorizedResponse extends ApiResponse {
    constructor(message = 'Authentication Failure') {
        super(ResponseStatus.UNAUTHORIZED, StatusCode.UNAUTHORIZED, message);
    }
}

export class NotFoundResponse extends ApiResponse {
    private url: string | undefined;

    constructor(message = 'Not Found') {
        super(ResponseStatus.NOTFOUND, StatusCode.NOT_FOUND, message);
    }

    send(res: Response): PayloadDto {
        this.url = res.req?.originalUrl;
        return super.prepare<NotFoundResponse>(res, this);
    }
}

export class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
        super(ResponseStatus.FORBIDDEN, StatusCode.FORBIDDEN, message);
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
        super(ResponseStatus.BADREQUEST, StatusCode.BAD_REQUEST, message);
    }
}

export class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error') {
        super(ResponseStatus.FAILURE, StatusCode.INTERNAL_ERROR, message);
    }
}

export class ConflictErrorResponse extends ApiResponse {
    constructor(message = 'Conflict Error') {
        super(ResponseStatus.CONFLICT, StatusCode.CONFLICT, message);
    }
}

export class SuccessMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(ResponseStatus.SUCCESS, StatusCode.SUCCESS, message);
    }
}

export class FailureMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(ResponseStatus.FAILURE, StatusCode.SUCCESS, message);
    }
}

