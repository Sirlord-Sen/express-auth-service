import { FullUser } from "src/api/modules/user/user.types";
import { 
    AccessTokenRequest, 
    AccessTokenResponse, 
    ForgotPasswordRequest, 
    FullRefreshToken, 
    LoginRequest, 
    LogoutRequest, 
    RefreshToken, 
    RefreshTokenRequest, 
    RefreshTokenResponse, 
    ResetPasswordRequest, 
    TokenPayload, 
    TokensRequest, 
    TokensResponse, 
} from "../auth.types";

export interface ITokenService{
    generateAccessToken(body:AccessTokenRequest, confirmTokenPassword?: string): Promise<AccessTokenResponse>
    generateRefreshToken(body:RefreshTokenRequest, useragent: Context): Promise<RefreshTokenResponse>
    getTokens(body: TokensRequest, ctx: Context):Promise<TokensResponse>
    update(query: Partial<FullRefreshToken>, body: Partial<RefreshToken>): Promise<void>
    resolveRefreshToken(token:string): Promise<TokensRequest> 
    decodeConfirmationToken(token:string): Promise<TokenPayload> 
}

export interface IAuthService{
    confirmAccount(token: string): Promise<Partial<FullUser>>
    login(body: LoginRequest): Promise<Partial<FullUser>>
    logout(body: LogoutRequest, ctx: Context): Promise<void>
    refreshToken(refreshToken: string, ctx: Context): Promise<Partial<TokensResponse>>
    forgotPassword(body: ForgotPasswordRequest): Promise<void> 
    resetPassword(body: ResetPasswordRequest): Promise<Partial<FullUser>> 
}