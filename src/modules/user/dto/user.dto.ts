import { IsString, IsEmail } from 'class-validator'

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