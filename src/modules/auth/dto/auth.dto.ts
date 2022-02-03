import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto{
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class ForgotPasswordDto{
    @IsNotEmpty()
    @IsEmail()
    email: string
}

export class ResetPasswordDto{
    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    token: string
}