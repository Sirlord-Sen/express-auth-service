import { IsBoolean, IsString } from 'class-validator'

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
    data: any
}

export class TokenPayloadDto extends PayloadDto{
    data: any
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