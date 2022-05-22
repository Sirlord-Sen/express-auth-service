import { Request } from 'express'
import { Controller, Req, Body, Post, UseBefore } from 'routing-controllers';
import { SuccessResponse } from '@utils/response.util';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, RefreshTokenDto, ConfirmAccountDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { TokenHelper } from '@helpers//';
import { LoginResponse, Payload, Tokens, UserResponse } from '@utils/utility-types';
import { Service } from 'typedi'

@Service()
@Controller('/api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ){}
 
    @Post('/confirm-account')
    async ConfirmAccount(@Req() req: Request, @Body() body: ConfirmAccountDto): Promise<Payload>{
        const { userAgent } = req
        const user = await this.authService.confirmAccount(body.token)
        const tokens = await this.tokenService.getTokens(user, userAgent)
        return new SuccessResponse<LoginResponse>("User Account Verified", { user, tokens })
    }

    @Post('/login')
    async Login(@Req() req: Request, @Body() body:LoginDto): Promise<Payload>{
        const { userAgent } = req
        const user = await this.authService.login(body)
        const tokens = await this.tokenService.getTokens({id: user.id, email: user.email}, userAgent)
        return new SuccessResponse<LoginResponse>('Login Successfull', { user, tokens})
    }

    @Post('/logout')
    @UseBefore(AuthMiddleware)
    async Logout(@Req() req: Request): Promise<Payload>{
        const { userAgent } = req
        const { userId } = req.currentUser;
        await this.authService.logout({ userId }, userAgent)
        return new SuccessResponse(`logged out`);
    }

    @Post('/refresh-token')
    async RefreshToken(@Req() req: Request, @Body() body: RefreshTokenDto): Promise<Payload> {
        const { userAgent } = req
        const refreshToken = body.refreshToken || TokenHelper.getTokenFromCookies(req.cookies)
        const tokens = await this.authService.refreshToken(refreshToken, userAgent)
        return new SuccessResponse<Tokens>('Refreshed Access Token', { tokens });
    }

    @Post('/forgot-password')
    async ForgotPassword(@Body() body: ForgotPasswordDto): Promise<Payload>{
        await this.authService.forgotPassword(body)
        return new SuccessResponse('Email Sent to user');
    }

    @Post('/reset-password')
    async ResetPassword(@Body() body: ResetPasswordDto): Promise<Payload>{
        const user = await this.authService.resetPassword(body)
        return new SuccessResponse<UserResponse>('Password changed', { user});
    }
}