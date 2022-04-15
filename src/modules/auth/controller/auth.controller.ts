import { Response, Request } from 'express'
import { Controller, Req, Res, Body, Post, UseBefore } from 'routing-controllers';
import { SuccessResponse } from '@utils/response.util';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from '../dto/auth.dto';
import {AuthService, TokenService} from '../services';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { TokenHelper } from '@helpers//';
import { RefreshTokenDto } from '../dto/token.dto';
import { PayloadDto, TokenPayloadDto, UserPayloadDto } from '@utils/utility-types';


@Controller('/api/auth')
export class AuthController {
    private readonly authService: AuthService
    private readonly tokenService: TokenService
    constructor(){
        this.authService = new AuthService()
        this.tokenService = new TokenService()
    }
    // FIX LOGINS WITH MULTIPLE DEVICES
    @Post('/login')
    async Login(@Body() body:LoginDto, @Req() req: any, @Res() res: Response): Promise<UserPayloadDto>{
        const { useragent } = req
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        const user = await this.authService.login(body)
        const tokens = await this.tokenService.getTokens(user, userAgent)
        return new SuccessResponse('Login Successfull', { user, tokens}).send()
    }

    @Post('/logout')
    @UseBefore(AuthMiddleware)
    async Logout(@Req() req: any, @Res() res: Response): Promise<PayloadDto>{
        const { useragent } = req
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        const { userId } = req.currentUser;
        await this.authService.logout({ userId }, userAgent)
        return new SuccessResponse(`User with email:'${userId}' logged out`, { }).send()
    }

    @Post('/refresh-token')
    async RefreshToken(@Req() req: Request, @Res() res: Response, @Body() body: RefreshTokenDto): Promise<TokenPayloadDto> {
        const refreshToken = body.refreshToken || TokenHelper.getTokenFromCookies(req.cookies)
        const tokens = await this.authService.refreshToken(refreshToken)
        return new SuccessResponse('Refreshed Access Token', { tokens }).send()
    }

    @Post('/forgot-password')
    async ForgotPassword(@Body() body: ForgotPasswordDto): Promise<UserPayloadDto>{
        const user = await this.authService.forgotPassword(body)
        return new SuccessResponse('Email Sent to user', { user}).send()
    }

    @Post('/reset-password')
    async ResetPassword(@Body() body: ResetPasswordDto): Promise<UserPayloadDto>{
        const user = await this.authService.resetPassword(body)
        return new SuccessResponse('Password Reset', { user}).send()
    }
}