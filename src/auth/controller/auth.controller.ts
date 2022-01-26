import { Response } from 'express'
import { Controller, Res, Body, Get, Post, Put, Delete, QueryParam } from 'routing-controllers';
import { SuccessResponse } from '../../common/middlewares/response.middleware';
import { SignUpDto, UserPayloadDto } from '../../user/dto/user.dto';
import { UserService } from '../../user/services/user.service'
import { AuthPayloadDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { addAuthToRes } from '../utils/auth.util'

@Controller('/api/auth')
export class UserController {
    private readonly userService: UserService
    private readonly authService: AuthService
    constructor(){
        this.userService = new UserService()
        this.authService = new AuthService()
    }

    @Post('/register')
    async Register(@Body() body:SignUpDto, @Res() res: Response): Promise<AuthPayloadDto>{
        try{
            const user = await this.userService.register(body)
            const accessToken = await this.authService.generateAccessToken(user)
            const refreshToken = await this.authService.generateRefreshToken(user)
            if (accessToken && refreshToken) addAuthToRes(res, accessToken, refreshToken);
            return new SuccessResponse('New User Created', {user: user}).send(res)
        }
        catch(err: any){ return err }
    }
}