import { FullUser } from "@modules/user/user.types";
import { IReturnUser } from "../user/interfaces/user.interface";
import { IRefreshToken, ITokenPayload } from "./interfaces/token.interface";

type Id = {
    id: string
}

type Token = {
    token: string;
}

export type RefreshTokenPayload = ITokenPayload
export type TokenRequest = Pick<IReturnUser, 'email' | 'id'>
export type AccessTokenPayload = Pick<IReturnUser, 'email'> & ITokenPayload
export type AccessTokenResponse = {accessToken: string, expiredAt: Date}
export type AccessTokenRequest = Pick<IRefreshToken, 'userId'> & Pick<AccessTokenPayload, 'email'>;

export type RefreshTokenRequest = Omit<IRefreshToken, 'jti' | 'expiredAt'>
export type RefreshToken = IRefreshToken
export type FullRefreshToken = RefreshToken & Id
export type LogoutRequest = Pick<IRefreshToken, 'userId'>
export type UpdateTokenRequest = LogoutRequest & Pick<IRefreshToken, 'isRevoked'>

export type ForgotPasswordRequest = Required<Pick<FullUser, 'email'>>;
export type ResetPasswordRequest = Required<Pick<FullUser, 'password'>> & Token