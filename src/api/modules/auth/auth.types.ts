import { FullUser } from "@user-module/user.types";
import { TokenType } from "@utils/utility-types";
import { IRefreshToken } from "./interfaces/refresh-token.interface";

export type Token = { tokenType: TokenType }

export type RefreshToken = IRefreshToken

export type FullRefreshToken = Id & RefreshToken & DateInfo 

export type RefreshTokenRequest = Pick<RefreshToken, 'userId'>

export type RefreshTokenResponse = { refreshToken: string }

export type AccessTokenRequest = Pick<RefreshToken, 'userId'> & Pick<FullUser, 'email'>;

export type AccessTokenResponse = {accessToken: string, expiresAt: Date}

export type TokenPayload = Pick<RefreshToken, 'jti'> & { sub: string, typ: string, email: string }

export type TokensRequest = Pick<FullUser, 'email' | 'id'>

export type TokensResponse =  Token & AccessTokenResponse & RefreshTokenResponse

export type LoginRequest = Required<Pick<FullUser, 'email' | 'password'>>;
;
export type LogoutRequest = RefreshTokenResponse

export type ForgotPasswordRequest = Required<Pick<FullUser, 'email'>>;

export type ResetPasswordRequest = Required<Pick<FullUser, 'password'>> & { token: string }
