import { IsString } from 'class-validator'

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

export enum TokenType {
    BEARER = 'Bearer'
}