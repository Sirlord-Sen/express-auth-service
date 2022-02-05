import { IsString } from 'class-validator'
import { ITokenResponse } from '@modules/auth/interfaces/token.interface'
import { UserPayloadInterface } from '@modules/user/interfaces/user.interface'

export class PayloadDto{
    @IsString()
    program: string

    @IsString()
    version: string

    @IsString()
    release: string

    @IsString()
    datetime: Date

    @IsString()
    status: string

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