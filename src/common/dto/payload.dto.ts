import { IsString } from 'class-validator'
import { AuthPayloadInterface } from '../../auth/interfaces/auth.interface'
import { UserPayloadDto } from '../../user/dto/user.dto'

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
