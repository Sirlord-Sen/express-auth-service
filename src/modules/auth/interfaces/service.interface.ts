import { FullUser } from "@user/user.types";
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
    UserAgent 
} from "../auth.types";

export interface ITokenService{
    generateAccessToken(body:AccessTokenRequest, confirmTokenPassword?: string): Promise<AccessTokenResponse>
    generateRefreshToken(body:RefreshTokenRequest, useragent: UserAgent): Promise<RefreshTokenResponse>
    getTokens(body: TokensRequest, agent: UserAgent):Promise<TokensResponse>
    update(query: Partial<FullRefreshToken>, body: Partial<RefreshToken>): Promise<void>
    resolveRefreshToken(token:string): Promise<TokensRequest> 
    decodeConfirmationToken(token:string): Promise<TokenPayload> 
}

export interface IAuthService{
    confirmAccount(token: string): Promise<Partial<FullUser>>
    login(body: LoginRequest): Promise<Partial<FullUser>>
    logout(body: LogoutRequest, useragent: UserAgent): Promise<void>
    refreshToken(refreshToken: string, agent: UserAgent): Promise<Partial<TokensResponse>>
    forgotPassword(body: ForgotPasswordRequest): Promise<void> 
    resetPassword(body: ResetPasswordRequest): Promise<Partial<FullUser>> 
}