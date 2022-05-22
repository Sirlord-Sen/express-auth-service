import { response } from 'express';
import { ExceptionCore } from "@core//";
import { ErrorType } from "@utils/utility-types";

// Custom Error for resource not found
export default class NotFoundError extends ExceptionCore {
    constructor(message = 'Not Found') {
        super(ErrorType.NOT_FOUND, message);
        return super.handle(this, response);
    }
}