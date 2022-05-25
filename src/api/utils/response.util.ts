import { response, Response } from 'express';
import { DataResponses } from './utility-types';

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
    constructor(
        public success: boolean,
        public status_code: StatusCode,
        public message: string,
        public error?: ResponseStatus | string,
        public data?: DataResponses
    ){}


    protected prepare<T extends ApiResponse>(res: Response, response: T){
        res.status(this.status_code)
        return ApiResponse.sanitize(response)   
    }

    public send(res: Response){
        return this.prepare<ApiResponse>(res, this);
    }

    private static sanitize<T extends ApiResponse>(response: T){
        const clone: T = {} as T;
        Object.assign(clone, response);
        
        for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
        return clone;
    }
}

// Custom Response for Success
export class SuccessResponse<T extends DataResponses> extends ApiResponse{
    constructor(message: string, data?: T) {
        super( Success.SUCCESS, StatusCode.SUCCESS, message, undefined, data);
        super.prepare<SuccessResponse<T>>(response, this);
    }
}

// Custom Response for Not Found Error
export class NotFoundResponse extends ApiResponse {
    private url: string | undefined;

    constructor(message = 'Not Found') {
        super(Success.ERROR, StatusCode.NOT_FOUND, message, ResponseStatus.NOTFOUND );
        this.url = response.req?.originalUrl;
        super.prepare<NotFoundResponse>(response, this);
    }
}

// Custom Response for Unauthorized Error
export class UnauthorizedResponse extends ApiResponse {
    constructor(message = 'Authentication Failure') {
        super(Success.ERROR, StatusCode.UNAUTHORIZED, message, ResponseStatus.UNAUTHORIZED);
    }
}

// Custom Response for Forbidden Error
export class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
        super(Success.ERROR, StatusCode.FORBIDDEN, message, ResponseStatus.FORBIDDEN);
    }
}

// Custom Response for BadRequest Error
export class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
        super(Success.ERROR, StatusCode.BAD_REQUEST, message, ResponseStatus.BADREQUEST);
    }
}

// Custom Response for InternalServer Error
export class InternalServerErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error', error = '') {
        super(Success.ERROR, StatusCode.INTERNAL_ERROR, message, error || ResponseStatus.INTERNAL);
    }
}

// Custom Response for Conflict Error
export class ConflictErrorResponse extends ApiResponse {
    constructor(message = 'Conflict Error') {
        super(Success.ERROR, StatusCode.CONFLICT, message, ResponseStatus.CONFLICT);
    }
}

// Custom Response for Failure Error
export class FailureMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(Success.ERROR, StatusCode.SUCCESS, message, ResponseStatus.FAILURE);
    }
}
