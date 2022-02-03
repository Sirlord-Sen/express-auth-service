import { AuthMiddleware } from '../../../middlewares/auth.middleware';
import { Response } from 'express'
import { Controller, Res, Body, Post, Get, Req, UseBefore, Put } from 'routing-controllers';
import { SuccessResponse } from '../../../utils/response.util';
import { UserPayloadDto } from '../../../utils/util-types';
import { ResetPasswordDto, SignUpDto } from '../dto/user.dto';
import UserService  from '../services/user.service'

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

    @Get('/current')
    @UseBefore(AuthMiddleware)
    async GetCurrentUser(@Req() req: any): Promise<UserPayloadDto> {
        const { userId } = req.currentUser
        const user = await this.userService.findOne({id: userId})
        return new SuccessResponse('Current User Found', {user: user}).send()
    }

    @Post('/reset-password')
    @UseBefore(AuthMiddleware)
    async ResetPassword(@Body() body:ResetPasswordDto, @Req() req: any): Promise<UserPayloadDto> {
        const { userId } = req.currentUser
        const user = await this.userService.updatePassword({id: userId}, body)
        return new SuccessResponse('Password Changed Successfully', {user: user}).send()
    }

    @Put('/update')
    @UseBefore(AuthMiddleware)
    async UpdatedUser(@Body() body:any, @Req() req: any) {
        const { userId } = req.currentUser
        const user = await this.userService.update({id: userId}, body)
        return new SuccessResponse('Updated User', {user: user}).send()
    }
}