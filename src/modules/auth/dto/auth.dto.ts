import { IsEmail, IsString } from 'class-validator'

export class LoginDto{
    @IsEmail()
    email: string

    @IsString()
    password: string
}

export class ForgotPasswordDto{
    @IsEmail()
    email: string
}

export class ResetPasswordDto{
    @IsEmail()
    email: string

    @IsString()
    token: string
}