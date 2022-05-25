import { response } from 'express';

import { ExceptionCore } from "@core//";
import { ErrorType } from "@utils/utility-types";

// Custom Error for forbidden requests
export default class ForbiddenError extends ExceptionCore {
    constructor(message = 'Permission denied') {
        super(ErrorType.FORBIDDEN, message);
        return super.handle(this, response)
    }
}