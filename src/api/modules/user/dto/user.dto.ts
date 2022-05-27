import { IsString, IsEmail, IsNotEmpty, IsOptional, ValidateNested, IsObject } from 'class-validator'
import { Type } from 'class-transformer'

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
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateProfile)
    profile?: UpdateProfile
}


export class ChangePasswordDto{
    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    newPassword: string
}