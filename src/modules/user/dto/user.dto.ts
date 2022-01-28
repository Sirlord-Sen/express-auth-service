import { IsString, IsEmail } from 'class-validator'
import { PayloadDto } from '../../../utils/util-types'
import { UserPayloadInterface } from '../interfaces/user.interface'
import { IReturnUser } from '../interfaces/user.interface'

export class SignUpDto{
    @IsString()
    username: string

    @IsEmail()
    email: string

    @IsString()
    firstname: string

    @IsString()
    surname: string

    @IsString()
    password: string
}


export class UserPayloadDto extends PayloadDto{
    data: UserPayloadInterface
}