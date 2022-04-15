import { FullUser } from "@modules/user/user.types";
import { TokenType } from "@utils/utility-types";
import { Response } from "express";
import { IRefreshToken } from "./interfaces/refresh-token.interface";

export type Token = { tokenType: TokenType }

export type RefreshToken = IRefreshToken

export type FullRefreshToken = Id & RefreshToken & DateInfo 

export type RefreshTokenRequest = Pick<RefreshToken, 'userId'>

export type RefreshTokenResponse = { refreshToken: string }

export type AccessTokenRequest = Pick<RefreshToken, 'userId'> & Pick<FullUser, 'email'>;

export type AccessTokenResponse = {accessToken: string, expiredAt: Date}

export type TokenPayload = Pick<RefreshToken, 'jti'> & { sub: string, typ: string, email: string }

export type TokensRequest = Pick<FullUser, 'email' | 'id'>

export type TokensResponse =  Token & AccessTokenResponse & RefreshTokenResponse

export type LoginRequest = Required<Pick<FullUser, 'email' | 'password'>>;

export type LogoutRequest = Required<Pick<IRefreshToken, 'userId'>>

export type ForgotPasswordRequest = Required<Pick<FullUser, 'email'>>;

export type ResetPasswordRequest = Required<Pick<FullUser, 'password'>> & { token: string }

export type UserAgent = Pick<RefreshToken, 'browser' | 'os' | 'ip' | 'userAgent'>
