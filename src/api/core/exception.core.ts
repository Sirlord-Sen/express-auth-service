import { Response } from 'express';

import { ErrorType } from '@utils/utility-types'
import {
    UnauthorizedResponse,
    InternalServerErrorResponse,
    NotFoundResponse,
    BadRequestResponse,
    ForbiddenResponse,
    ConflictErrorResponse
} from '../utils/response.util'
import { AppConfig } from '@config//';

/**
* @class @abstract 
* @extends { Error } extends the main Error Object 
* @constructor super Error class
* @param { ErrorType } type - Type of Error
* @param { string } message - The Error Message
* @param { error } type - Custom Error Type Message
*/
export default abstract class ExceptionCore extends Error {
    constructor(public type: ErrorType, public message: string = 'error', public error?: string) {
        super(type);
    }

    protected handle(err: ExceptionCore, res: Response): any {

        switch (err.type) {
            case ErrorType.UNAUTHORIZED:
                return new UnauthorizedResponse(err.message).send(res)
            case ErrorType.INTERNAL:
                return new InternalServerErrorResponse(err.message, err.error).send(res);
            case ErrorType.CONFLICT:
                return new ConflictErrorResponse(err.message).send(res)
            case ErrorType.NOTFOUND:
            case ErrorType.NOENTRY:
            case ErrorType.NODATA:
                return new NotFoundResponse(err.message).send(res);
            case ErrorType.BADREQUEST:
                return new BadRequestResponse(err.message).send(res);
            case ErrorType.FORBIDDEN:
                return new ForbiddenResponse(err.message).send(res);
            default: {
                let message = err.message;
                // Do not send failure message in production as it may send sensitive data
                if (AppConfig.env === 'production') message = 'Something wrong happened.';
                return new InternalServerErrorResponse(message).send(res);
            }
        }
    }
}