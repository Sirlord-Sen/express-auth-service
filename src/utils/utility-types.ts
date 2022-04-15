import { IsBoolean, IsString } from 'class-validator'
import { ITokenResponse } from '@modules/auth/interfaces/refresh-token.interface'
import { UserPayloadInterface } from '@modules/user/user.types'

export class PayloadDto{
    @IsString()
    program: string

    @IsString()
    version: string

    @IsString()
    release: string

    @IsString()
    datetime: Date

    @IsBoolean()
    success: boolean

    @IsString()
    status?: string

    @IsString()
    message: string

    data: any

}

export class UserPayloadDto extends PayloadDto{
    data: UserPayloadInterface
}

export class TokenPayloadDto extends PayloadDto{
    data: ITokenResponse
}

export type ResponsePayload = PayloadDto | TokenPayloadDto | UserPayloadDto

export enum TokenType {
    BEARER = 'Bearer'
}

export interface CodeError extends Error {
    code?: string;
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}