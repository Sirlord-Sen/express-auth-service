import { IsEmail, IsString, Validate } from 'class-validator'

export class LoginDto{
    @IsEmail()
    email: string

    @IsString()
    password: string
}