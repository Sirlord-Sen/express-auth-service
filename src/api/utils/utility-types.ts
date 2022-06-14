export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export enum TokenType {
    BEARER = 'Bearer'
}

export enum ErrorType {
    UNAUTHORIZED = 'AuthFailureError',
    INTERNAL = 'InternalError',
    NOTFOUND = 'NotFoundError',
    NOENTRY = 'NoEntryError',
    NODATA = 'NoDataError',
    BADREQUEST = 'BadRequestError',
    FORBIDDEN = 'ForbiddenError',
    CONFLICT = 'ConflictError',
    FAILURE = 'FailError',
}



export interface CodeError extends Error {
    code?: string;
}