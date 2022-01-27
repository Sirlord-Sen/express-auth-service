import { Response } from 'express'
import { Controller, Res, Body, Get, Post, Put, Delete, QueryParam } from 'routing-controllers';
import { SuccessResponse } from '../../common/middlewares/response.middleware';
import { SignUpDto } from '../dto/user.dto';
import UserService  from '../../user/services/user.service'
import { AuthPayloadDto } from '../../auth/dto/auth.dto';

@Controller('/api/user')
export class UserController {
    private readonly userService: UserService
    constructor(){
        this.userService = new UserService()
    }

    @Post('/register')
    async Register(@Body() body:SignUpDto, @Res() res: Response): Promise<AuthPayloadDto>{
        try{
            const user = await this.userService.register(body)
            return new SuccessResponse('New User Created', {user: user}).send(res)
        }
        catch(err: any){ return err }
    }
}