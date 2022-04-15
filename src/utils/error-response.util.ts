import { response, Response } from 'express';
import {
    UnauthorizedResponse,
    InternalServerErrorResponse,
    NotFoundResponse,
    BadRequestResponse,
    ForbiddenResponse,
    ConflictErrorResponse
} from './response.util'

enum ErrorType {
    BAD_TOKEN = 'BadTokenError',
    TOKEN_EXPIRED = 'TokenExpiredError',
    UNAUTHORIZED = 'AuthFailureError',
    ACCESS_TOKEN = 'AccessTokenError',
    INTERNAL = 'InternalError',
    NOT_FOUND = 'NotFoundError',
    NO_ENTRY = 'NoEntryError',
    NO_DATA = 'NoDataError',
    BAD_REQUEST = 'BadRequestError',
    FORBIDDEN = 'ForbiddenError',
    CONFLICT = 'ConflictError'
}

/**
* @class @abstract 
* @extends { Error } extends the main Error Object 
* @constructor super Error class
* @param { ErrorType } type - Type of Error
* @param { string } message - The Error Message
* @param { error } type - Custom Error Type Message
*/
export abstract class ApiError extends Error {
    constructor(public type: ErrorType, public message: string = 'error', public error?: string) {
        super(type);
    }

    protected handle(err: ApiError, res: Response): any {

        switch (err.type) {
            case ErrorType.UNAUTHORIZED:
                return new UnauthorizedResponse(err.message).send(res)
            case ErrorType.INTERNAL:
                return new InternalServerErrorResponse(err.message, err.error).send(res);
            case ErrorType.CONFLICT:
                return new ConflictErrorResponse(err.message).send(res)
            case ErrorType.NOT_FOUND:
            case ErrorType.NO_ENTRY:
            case ErrorType.NO_DATA:
                return new NotFoundResponse(err.message).send(res);
            case ErrorType.BAD_REQUEST:
                return new BadRequestResponse(err.message).send(res);
            case ErrorType.FORBIDDEN:
                return new ForbiddenResponse(err.message).send(res);
            default: {
                let message = err.message;
                // Do not send failure message in production as it may send sensitive data
                if (process.env.NODE_ENV === 'production') message = 'Something wrong happened.';
                return new InternalServerErrorResponse(message).send(res);
            }
        }
    }
}

// Custom Error for Unauthorized requests
export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized User') {
        super(ErrorType.UNAUTHORIZED, message);
        return super.handle(this, response)
    }
}

// Custom Error for all other errors
export class InternalServerError extends ApiError {
    constructor(message = 'Internal error', error?: string) {
        super(ErrorType.INTERNAL, message, error);
        return super.handle(this, response)
    }
}

// Custom Error for Conflicting requests
export class ConflictError extends ApiError {
    constructor(message = 'Conflict error') {
        super(ErrorType.CONFLICT, message);
        return super.handle(this, response);
    }
}

// Custom Error for Bad requests requests
export class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(ErrorType.BAD_REQUEST, message);
        return super.handle(this, response);
    }
}

// Custom Error for resource not found
export class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(ErrorType.NOT_FOUND, message);
        return super.handle(this, response);
    }
}

// Custom Error for forbidden requests
export class ForbiddenError extends ApiError {
    constructor(message = 'Permission denied') {
        super(ErrorType.FORBIDDEN, message);
        return super.handle(this, response)
    }
}

// Custom Error for no entry errors
export class NoEntryError extends ApiError {
    constructor(message = "Entry don't exists") {
        super(ErrorType.NO_ENTRY, message);
    }
}

// Custom Error for no data available
export class NoDataError extends ApiError {
    constructor(message = 'No data available') {
        super(ErrorType.NO_DATA, message);
    }
}
