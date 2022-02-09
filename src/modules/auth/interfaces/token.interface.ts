import { Response } from "express";
import { TokenType } from "@utils/util-types";

export interface ITokenPayload{
    jti: string;
    sub: string;
    typ: string;
};


export interface IRefreshToken {
    browser?: string;
    expiredAt: Date;
    ip?: string;
    isRevoked?: boolean;
    jti: string;
    os?: string;
    userAgent?: string;
    userId: string;
}
  
export interface ITokenResponse {
  accessToken: string,
  refreshToken: string,
  tokenType: TokenType,
  expiredAt: Date
}

export interface TokenResponse {
  ( res: Response,
    tokens: ITokenResponse): void
}

export interface IRefreshTokenRequest{
    refreshToken: string
}