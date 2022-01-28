import { Response } from 'express'
import { Controller, Res, Body, Get, Post, Put, Delete, QueryParam } from 'routing-controllers';
import { SuccessResponse } from '../../../utils/response.util';
import { LoginDto } from '../dto/auth.dto';
import UserService from '../../user/services/user.service'
import {AuthService, TokenService} from '../services';
import { addAuthToRes } from '../utils/auth.util'

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
    async Login(@Body() body:LoginDto, @Res() res: Response): Promise<any>{
        try{
            const user = await this.authService.login(body)
            const tokens = await this.tokenService.getTokens(user)
            const { accessToken, refreshToken } = tokens
            if (accessToken && refreshToken) addAuthToRes(res, accessToken, refreshToken);
            return new SuccessResponse('New User Created', {user: user, payload: tokens}).send(res)
            
        }
        catch(err: any){ return err }
    }
}