import { Response, Request } from 'express'
import { Controller, Req, Res, Body, Post, UseBefore } from 'routing-controllers';
import { SuccessResponse } from '@utils/response.util';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, RefreshTokenDto } from '../dto/auth.dto';
import {AuthService, TokenService} from '../services';
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
 
    @Post('/login')
    async Login(@Req() req: Request, @Body() body:LoginDto): Promise<Payload>{
        const { useragent } = req
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        const user = await this.authService.login(body)
        const tokens = await this.tokenService.getTokens({id: user.id, email: user.email}, userAgent)
        return new SuccessResponse<LoginResponse>('Login Successfull', { user, tokens})
    }

    @Post('/logout')
    @UseBefore(AuthMiddleware)
    async Logout(@Req() req: Request): Promise<Payload>{
        const { useragent } = req
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        const { userId } = req.currentUser;
        await this.authService.logout({ userId }, userAgent)
        return new SuccessResponse<{}>(`User with email:'${userId}' logged out`, { });
    }

    @Post('/refresh-token')
    async RefreshToken(@Req() req: Request, @Res() res: Response, @Body() body: RefreshTokenDto): Promise<Payload> {
        const refreshToken = body.refreshToken || TokenHelper.getTokenFromCookies(req.cookies)
        const tokens = await this.authService.refreshToken(refreshToken)
        return new SuccessResponse<Tokens>('Refreshed Access Token', { tokens });
    }

    @Post('/forgot-password')
    async ForgotPassword(@Body() body: ForgotPasswordDto): Promise<Payload>{
        const user = await this.authService.forgotPassword(body)
        return new SuccessResponse<UserResponse>('Email Sent to user', { user});
    }

    @Post('/reset-password')
    async ResetPassword(@Body() body: ResetPasswordDto): Promise<Payload>{
        const user = await this.authService.resetPassword(body)
        return new SuccessResponse<UserResponse>('Password Reset', { user});
    }
}