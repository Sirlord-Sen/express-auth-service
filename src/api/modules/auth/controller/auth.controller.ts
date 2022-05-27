import { Request } from 'express'
import { Service } from 'typedi'
import { ResponseSchema } from 'routing-controllers-openapi';
import { Controller, Req, Body, Post, Authorized, CurrentUser } from 'routing-controllers';

import { TokenHelper } from '@helpers//';
import { SuccessResponse } from '@utils/response.util';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { 
    ForgotPasswordDto, 
    LoginDto, 
    ResetPasswordDto, 
    RefreshTokenDto, 
    ConfirmAccountDto 
} from '../dto/auth.dto';
import { 
    BasePayload, 
    DataLogin, 
    DataTokens, 
    DataUser, 
    LoginResponse, 
    TokensResponse, 
    UserResponse
} from '@utils/utility-types';

@Service()
@Controller('/api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ){}
 
    @Post('/confirm-account')
    @ResponseSchema(LoginResponse)
    async ConfirmAccount(@Req() req: Request, @Body() body: ConfirmAccountDto): Promise<BasePayload>{
        const user = await this.authService.confirmAccount(body.token)
        const tokens = await this.tokenService.getTokens(user, req.ctx)
        return new SuccessResponse<DataLogin>("User Account Verified", { user, tokens })
    }

    @Post('/login')
    @ResponseSchema(LoginResponse)
    async Login(@Req() req: Request, @Body() body:LoginDto): Promise<BasePayload>{
        const user = await this.authService.login(body)
        const tokens = await this.tokenService.getTokens({id: user.id, email: user.email}, req.ctx)
        return new SuccessResponse<DataLogin>('Login Successfull', { user, tokens })
    }
    
    @Post('/logout')
    @Authorized()
    @ResponseSchema(BasePayload)
    async Logout(@Req() req: Request, @CurrentUser() {userId}: CurrentUser ): Promise<BasePayload>{
        await this.authService.logout({ userId }, req.ctx)
        return new SuccessResponse(`logged out`);
    }

    @Post('/refresh-token')
    @ResponseSchema(TokensResponse)
    async RefreshToken(@Req() req: Request, @Body() body: RefreshTokenDto): Promise<BasePayload> {
        const refreshToken = body.refreshToken || TokenHelper.getTokenFromCookies(req.cookies)
        const tokens = await this.authService.refreshToken(refreshToken, req.ctx)
        return new SuccessResponse<DataTokens>('Refreshed Access Token', { tokens });
    }

    @Post('/forgot-password')
    @ResponseSchema(BasePayload)
    async ForgotPassword(@Body() body: ForgotPasswordDto): Promise<BasePayload>{
        await this.authService.forgotPassword(body)
        return new SuccessResponse('Email Sent to user');
    }

    @Post('/reset-password')
    @ResponseSchema(UserResponse)
    async ResetPassword(@Body() body: ResetPasswordDto): Promise<BasePayload>{
        const user = await this.authService.resetPassword(body)
        return new SuccessResponse<DataUser>('Password changed', { user });
    }
}