import { Response, Request } from 'express'
import { Controller, Req, Res, Body, Post, UseBefore } from 'routing-controllers';
import { SuccessResponse } from '../../../utils/response.util';
import { LoginDto } from '../dto/auth.dto';
import UserService from '../../user/services/user.service'
import {AuthService, TokenService} from '../services';
import { addAuthToRes } from '../utils/auth.util'
import { AuthMiddleware } from '../../../middlewares/auth.middleware';
import { TokenHelper } from '../../../helpers';
import { RefreshTokenDto } from '../dto/token.dto';
import { PayloadDto, TokenPayloadDto, UserPayloadDto } from '../../../utils/util-types';

@Controller('/api/auth')
export class UserController {
    private readonly userService: UserService
    private readonly authService: AuthService
    private readonly tokenService: TokenService
    constructor(){
        this.userService = new UserService()
        this.authService = new AuthService()
        this.tokenService = new TokenService()
    }

    @Post('/login')
    async Login(@Body() body:LoginDto, @Res() res:Response, @Req() req: Request): Promise<UserPayloadDto>{
        try{
            // console.log(req.useragent)
            const user = await this.authService.login(body)
            const tokens = await this.tokenService.getTokens(user)
            if (tokens) addAuthToRes(res, tokens);
            return new SuccessResponse('New User Created', {user: user, payload: tokens}).send()
            
        }
        catch(err: any){ return err }
    }

    @Post('/logout')
    @UseBefore(AuthMiddleware)
    async Logout(@Req() req: any, @Res() res: Response): Promise<PayloadDto>{
        // console.log(req.useragent)
        const { userId, email } = req.currentUser;
        await this.authService.logout({ userId })
        return new SuccessResponse(`User with email:'${email}' logged out`, {user: null}).send()
    }

    @Post('/refresh-token')
    async RefreshToken(@Req() req: Request, @Res() res: Response, @Body() body: RefreshTokenDto): Promise<TokenPayloadDto> {
        const refreshToken = body.refreshToken || TokenHelper.getTokenFromCookies(req.cookies)
        const tokens = await this.authService.refreshToken({refreshToken: refreshToken})
        if (tokens) addAuthToRes(res, tokens);
        return new SuccessResponse('Refreshed Access Token', { payload: tokens}).send()
    }
}