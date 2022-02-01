import { IReturnUser } from "../user/interfaces/user.interface";
import { IRefreshToken, ITokenPayload, ITokenResponse } from "./interfaces/token.interface";

type Id = {
    id: string
}

export type RefreshTokenPayload = ITokenPayload
export type TokenRequest = Pick<IReturnUser, 'email' | 'id'>
export type AccessTokenPayload = Pick<IReturnUser, 'email'> & ITokenPayload
export type AccessTokenRequest = Pick<IRefreshToken, 'userId'> & Pick<AccessTokenPayload, 'email'>;

export type RefreshTokenRequest = Omit<IRefreshToken, 'jti' | 'expiredAt'>
export type RefreshToken = IRefreshToken
export type FullRefreshToken = RefreshToken & Id
export type LogoutRequest = Pick<IRefreshToken, 'userId'>
export type UpdateTokenRequest = LogoutRequest & Pick<IRefreshToken, 'isRevoked'>