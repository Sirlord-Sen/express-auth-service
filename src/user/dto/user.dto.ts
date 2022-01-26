import { IsString, IsEmail, IsNotEmpty, Length, isString, IsUUID} from 'class-validator'

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
    @IsUUID()
    id: string

    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @Length(1,250)
    firstname: string

    @IsString()
    @IsNotEmpty()
    surname: string

    constructor(username: string, email: string, firstname: string, surname: string){
        this.username = username,
        this.email = email,
        this.firstname = firstname,
        this.surname = surname
    }
}

export class LoginDto{
    @IsEmail()
    email: string
    
    @IsString()
    password: string
}