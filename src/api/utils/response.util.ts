import { response, Response } from 'express';
import { DataResponses } from './response.types';
import { ErrorType } from './utility-types';

const Success = {
    SUCCESS : true,
    ERROR : false
}

enum StatusCode {
    SUCCESS = 200,
    BADREQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOTFOUND = 404,
    INTERNALERROR = 500,
    CONFLICT = 409
}


abstract class ApiResponse {
    constructor(
        public success: boolean,
        public status_code: StatusCode,
        public message: string,
        public error?: ErrorType | string,
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
        super(Success.ERROR, StatusCode.NOTFOUND, message, ErrorType.NOTFOUND );
        this.url = response.req?.originalUrl;
        super.prepare<NotFoundResponse>(response, this);
    }
}

// Custom Response for Unauthorized Error
export class UnauthorizedResponse extends ApiResponse {
    constructor(message = 'Authentication Failure') {
        super(Success.ERROR, StatusCode.UNAUTHORIZED, message, ErrorType.UNAUTHORIZED);
    }
}

// Custom Response for Forbidden Error
export class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Forbidden') {
        super(Success.ERROR, StatusCode.FORBIDDEN, message, ErrorType.FORBIDDEN);
    }
}

// Custom Response for BadRequest Error
export class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters') {
        super(Success.ERROR, StatusCode.BADREQUEST, message, ErrorType.BADREQUEST);
    }
}

// Custom Response for InternalServer Error
export class InternalServerErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error', error = '') {
        super(Success.ERROR, StatusCode.INTERNALERROR, message, error || ErrorType.INTERNAL);
    }
}

// Custom Response for Conflict Error
export class ConflictErrorResponse extends ApiResponse {
    constructor(message = 'Conflict Error') {
        super(Success.ERROR, StatusCode.CONFLICT, message, ErrorType.CONFLICT);
    }
}

// Custom Response for Failure Error
export class FailureMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(Success.ERROR, StatusCode.SUCCESS, message, ErrorType.FAILURE);
    }
}
