import { response } from 'express';

import { ExceptionCore } from "@core//";
import { ErrorType } from "@utils/utility-types";

// Custom Error for all other errors
export default class InternalServerError extends ExceptionCore {
    constructor(message = 'Internal error', error?: string) {
        super(ErrorType.INTERNAL, message, error);
        return super.handle(this, response)
    }
}