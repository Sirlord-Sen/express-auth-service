import { ExceptionCore } from "@core/";
import { ErrorType } from "@utils/utility-types";

// Custom Error for no entry errors
export default class NoEntryError extends ExceptionCore {
    constructor(message = "Entry don't exists") {
        super(ErrorType.NOENTRY, message);
    }
}
