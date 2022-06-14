import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { Type } from 'class-transformer'
import { IProfile, IUser } from "@modules/user/interfaces"
import { Gender, TokenType } from "./utility-types";

class BaseProfile implements IProfile{
    @IsString()
    firstname?: string;

    @IsString()
    lastname?: string;

    @IsEnum(Gender)
    gender?: Gender

    @IsString()
    picture?: string;
}

export class BaseUser implements IUser{
    @IsUUID()
    id: string

    @IsString()
    username: string

    @IsString()
    email: string;

    @ValidateNested()
    @Type(()=> BaseProfile)
    profile?: BaseProfile;
}

export class BaseToken{
    @IsEnum(TokenType)
    tokenType: TokenType

    @IsString()
    refreshToken: string

    @IsString()
    accessToken: string

    @IsDate()
    expiresAt: Date
}

export class BasePayload{
    @IsBoolean()
    success: boolean

    @IsNumber()
    status_code: number

    @IsString()
    message: string

    @IsOptional()
    @IsString()
    error?: string

    data?: DataResponses

}

export type DataResponses = DataLogin | DataTokens | DataUser



export class DataUser {
    @ValidateNested()
    @Type(() => BaseUser)
    user: BaseUser
}

export class DataLogin {
    @ValidateNested()
    @Type(() => BaseUser)
    user: BaseUser

    @ValidateNested()
    @Type(() => BaseToken)
    tokens: BaseToken
}

export class DataTokens {
    @ValidateNested()
    @Type(() => BaseToken)
    tokens: BaseToken
}

export class UserResponse extends BasePayload{
    @ValidateNested()
    @Type(() => DataUser)
    data?: DataUser
}

export class LoginResponse extends BasePayload{
    @ValidateNested()
    @Type(() => DataLogin)
    data?: DataLogin
}

export class TokensResponse extends BasePayload{
    @ValidateNested()
    @Type(() => DataTokens)
    data?: DataTokens
}