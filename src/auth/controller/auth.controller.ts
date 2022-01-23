import { Response } from 'express'
import { JsonController, Res, Body, Get, Post, Put, Delete, QueryParam } from 'routing-controllers';
import { SuccessResponse } from '../../common/middlewares/response.middleware';
import { SignUpDto } from '../../user/dto/user.dto';
import { UserService } from '../../user/services/user.service'
import { AuthPayloadDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@JsonController('/api/auth')
export class UserController {
    private readonly userService: UserService
    private readonly authService: AuthService
    constructor(){
        this.userService = new UserService()
        this.authService = new AuthService()
    }

    @Post('/register')
    async post(@Body() body: SignUpDto, @Res() res: Response): Promise<any>{
        try{
            const savedUSer = await this.userService.signup(body)
            return new SuccessResponse('success', {user: savedUSer}).send(res)
        }
        catch(err){
            res.json(await err)
        }
    }
}