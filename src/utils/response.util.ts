import { response, Response } from 'express';
import { pick } from 'lodash';
import { PayloadDto, ResponsePayload, TokenPayloadDto } from './utility-types';

// Helper code for the API consumer to understand the error and handle is accordingly
enum ResponseStatus {
    FAILURE = 'FailError',
    INTERNAL = 'InternalServerError',
    NOTFOUND = 'NotFoundError',
    BADREQUEST = 'BadRequestError',
    CONFLICT = 'ConflictError',
    UNAUTHORIZED = 'UnauthorizedError',
    FORBIDDEN = 'ForbiddenError',
}

const Success = {
    SUCCESS : true,
    ERROR : false
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
        public code: StatusCode,
        public message: string,
        public success: boolean,
        public error?: ResponseStatus | string,
    ) {
        this.program = 'stud-aid microservice'
        this.version = 'v1'
        this.release = '1.2.1'
        this.datetime = new Date()
        this.data = {}
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
        const output = pick(clone, ["program", "version", "release", "datetime", "success", "error", "message", "data"])
        return output;
    }
}

export class SuccessResponse<T> extends ApiResponse{
    constructor(message: string, public data: T) {
        super(StatusCode.SUCCESS, message, Success.SUCCESS);
    }
    send(): PayloadDto { return super.prepare<SuccessResponse<T>>(response, this); }
}

export class UnauthorizedResponse extends ApiResponse {
    constructor(message = 'Authentication Failure') {
        super(StatusCode.UNAUTHORIZED, message, Success.ERROR, ResponseStatus.UNAUTHORIZED);
    }
}

export class NotFoundResponse extends ApiResponse {
    private url: string | undefined;

    constructor(message = 'Not Found') {
        super(StatusCode.NOT_FOUND, message, Success.ERROR, ResponseStatus.NOTFOUND,);
    }

    send(res: Response): PayloadDto {
        this.url = res.req?.originalUrl;
        return super.prepare<NotFoundResponse>(res, this);
    }
}

export class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
        super(StatusCode.FORBIDDEN, message, Success.ERROR, ResponseStatus.FORBIDDEN);
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
        super(StatusCode.BAD_REQUEST, message, Success.ERROR, ResponseStatus.BADREQUEST);
    }
}

export class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error', error = '') {
        super(StatusCode.INTERNAL_ERROR, message, Success.ERROR, error || ResponseStatus.INTERNAL);
    }
}

export class ConflictErrorResponse extends ApiResponse {
    constructor(message = 'Conflict Error') {
        super(StatusCode.CONFLICT, message, Success.ERROR, ResponseStatus.CONFLICT);
    }
}

export class SuccessMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.SUCCESS, message, Success.SUCCESS);
    }
}

export class FailureMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.SUCCESS, message, Success.ERROR, ResponseStatus.FAILURE);
    }
}

