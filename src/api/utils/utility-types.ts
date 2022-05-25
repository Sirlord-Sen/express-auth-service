import { TokensResponse } from "@auth-module/auth.types"
import { FullUser } from "@user-module/user.types"

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export class Payload{
    success: boolean
    status_code: number
    message: string
    error?: string
    data?: DataResponses
}

export type UserResponse = {
    user: Partial<FullUser>
}

export type Tokens = {
    tokens: TokensResponse
}

export type LoginResponse = UserResponse & Tokens

type LogoutResponse = {}

export type DataResponses = UserResponse | Tokens | LoginResponse | LogoutResponse

export enum TokenType {
    BEARER = 'Bearer'
}

export interface CodeError extends Error {
    code?: string;
}

export enum ErrorType {
    BAD_TOKEN = 'BadTokenError',
    TOKEN_EXPIRED = 'TokenExpiredError',
    UNAUTHORIZED = 'AuthFailureError',
    ACCESS_TOKEN = 'AccessTokenError',
    INTERNAL = 'InternalError',
    NOT_FOUND = 'NotFoundError',
    NO_ENTRY = 'NoEntryError',
    NO_DATA = 'NoDataError',
    BAD_REQUEST = 'BadRequestError',
    FORBIDDEN = 'ForbiddenError',
    CONFLICT = 'ConflictError'
}