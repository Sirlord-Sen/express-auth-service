import { IsString, IsEmail} from 'class-validator'

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

export class UserPayloadDto{
    @IsString()
    username: string

    @IsEmail()
    email: string

    @IsString()
    firstname: string

    @IsString()
    surname: string
}

export class LoginDto{
    @IsEmail()
    email: string
    
    @IsString()
    password: string
}