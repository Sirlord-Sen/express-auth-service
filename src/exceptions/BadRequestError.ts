import { response } from 'express';
import { ExceptionCore } from "@core//";
import { ErrorType } from "@utils/utility-types";

// Custom Error for Bad requests requests
export default class BadRequestError extends ExceptionCore {
    constructor(message = 'Bad Request') {
        super(ErrorType.BAD_REQUEST, message);
        return super.handle(this, response);
    }
}