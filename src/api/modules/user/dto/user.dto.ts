import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

import { Gender } from '@utils/utility-types'

export class SignUpDto{
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}

class UpdateProfile{
    @IsOptional()
    @IsString()
    firstname?: string

    @IsOptional()
    @IsString()
    lastname?: string

    @IsOptional()
    @IsString()
    gender?: Gender

    @IsOptional()
    @IsString()
    picture?: string
}

export class UpdateUserDto{
    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    profile?: UpdateProfile
}


export class ResetPasswordDto{
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    newPassword: string
}