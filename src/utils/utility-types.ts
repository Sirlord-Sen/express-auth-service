import { TokensResponse } from "@modules/auth/auth.types"
import { FullUser } from "@modules/user/user.types"

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

// export class RegisterPayload extends Payload{}
// export class ForgotPasswordPayload extends Payload{}
// export class ResetPasswordPayload extends Payload{}
// export class UserPayload extends Payload{}
// export class LoginPayload extends Payload{}
// export class LogoutPayload extends Payload{}
// export class TokensPayload extends Payload{}

export enum TokenType {
    BEARER = 'Bearer'
}

export interface CodeError extends Error {
    code?: string;
}