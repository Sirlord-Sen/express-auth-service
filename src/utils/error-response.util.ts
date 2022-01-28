import { response, Response } from 'express';
import { PayloadDto } from './util-types';
import {
    UnauthorizedResponse,
    InternalErrorResponse,
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

export abstract class ApiError extends Error {
    constructor(public type: ErrorType, public message: string = 'error') {
        super(type);
    }

    protected handle(err: ApiError, res: Response): PayloadDto {

        switch (err.type) {
            case ErrorType.UNAUTHORIZED:
                return new UnauthorizedResponse(err.message).send(res);
            case ErrorType.INTERNAL:
                return new InternalErrorResponse(err.message).send(res);
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
                return new InternalErrorResponse(message).send(res);
            }
        }
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'Invalid Credentials') {
        super(ErrorType.UNAUTHORIZED, message);
    }
    send(): PayloadDto { return super.handle(this, response) }
}

export class InternalError extends ApiError {
    constructor(message = 'Internal error') {
        super(ErrorType.INTERNAL, message);
    } 
    send(): PayloadDto { return super.handle(this, response) }
}

export class ConflictError extends ApiError {
    constructor(message = 'Conflict error') {
        super(ErrorType.CONFLICT, message);
    } 
    send(): PayloadDto { return super.handle(this, response) }
}

export class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(ErrorType.BAD_REQUEST, message);
    }
    send(): PayloadDto { return super.handle(this, response) }
}

export class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(ErrorType.NOT_FOUND, message);
    }
    send(): PayloadDto { return super.handle(this, response) }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'Permission denied') {
        super(ErrorType.FORBIDDEN, message);
    }
}

export class NoEntryError extends ApiError {
    constructor(message = "Entry don't exists") {
        super(ErrorType.NO_ENTRY, message);
    }
}

export class NoDataError extends ApiError {
    constructor(message = 'No data available') {
        super(ErrorType.NO_DATA, message);
    }
}
