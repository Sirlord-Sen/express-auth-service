import { ExceptionCore } from "@core//";
import { ErrorType } from "@utils/utility-types";

// Custom Error for no data available
export default class NoDataError extends ExceptionCore {
    constructor(message = 'No data available') {
        super(ErrorType.NODATA, message);
    }
}