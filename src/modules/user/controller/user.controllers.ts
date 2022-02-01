import { Response } from 'express'
import { Controller, Res, Body, Get, Post, Put, Delete, QueryParam } from 'routing-controllers';
import { SuccessResponse } from '../../../utils/response.util';
import { SignUpDto } from '../dto/user.dto';
import UserService  from '../services/user.service'
import { UserPayloadDto } from '../dto/user.dto';

@Controller('/api/user')
export class UserController {
    private readonly userService: UserService
    constructor(){
        this.userService = new UserService()
    }

    @Post('/register')
    async Register(@Body() body:SignUpDto, @Res() res: Response): Promise<UserPayloadDto>{
        try{
            const user = await this.userService.register(body)
            return new SuccessResponse('New User Created', {user: user}).send()
        }
        catch(err: any){ return err }
    }
}