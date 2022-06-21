import { response } from 'express';

import { ExceptionCore } from "@core/";
import { ErrorType } from "@utils/utility-types";

// Custom Error for Conflicting requests
export default class ConflictError extends ExceptionCore {
    constructor(message = 'Conflict error') {
        super(ErrorType.CONFLICT, message);
        return super.handle(this, response);
    }
}