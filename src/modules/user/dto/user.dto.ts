import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class SignUpDto{
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    firstname: string

    @IsNotEmpty()
    @IsString()
    surname: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class UpdateUserDto{
    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    firstname?: string

    @IsOptional()
    @IsString()
    surname?: string
}

export class ResetPasswordDto{
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    newPassword: string
}