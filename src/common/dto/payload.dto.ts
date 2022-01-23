import { IsString, IsEmail, IsNumber} from 'class-validator'

export class PayloadDto{
    @IsString()
    program: string

    @IsString()
    version: string

    @IsString()
    release: string

    @IsString()
    datetime: Date

    @IsString()
    status: string

    @IsNumber()
    code: number

    @IsString()
    message: string
}
