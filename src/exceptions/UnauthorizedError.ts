import { response } from 'express';
import { ExceptionCore } from "@core//";
import { ErrorType } from "@utils/utility-types";

// Custom Error for Unauthorized requests
export default class UnauthorizedError extends ExceptionCore {
    constructor(message = 'Unauthorized User') {
        super(ErrorType.UNAUTHORIZED, message);
        return super.handle(this, response)
    }
}