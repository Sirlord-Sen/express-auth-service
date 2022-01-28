import { IReturnUser } from "../user/interfaces/user.interface";
import { IRefreshToken, ITokenPayload } from "./interfaces/token.interface";


export type TokenRequest = Pick<IReturnUser, 'email' | 'id'>
export type AccessTokenPayload = Pick<IReturnUser, 'email'> & ITokenPayload
export type AccessTokenRequest = Pick<IRefreshToken, 'userId'> & Pick<AccessTokenPayload, 'email'>;

export type RefreshTokenRequest = Omit<IRefreshToken, 'jti' | 'expiredAt'>
export type RefreshToken = IRefreshToken