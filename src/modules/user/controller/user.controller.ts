import { AuthMiddleware } from '@middlewares/auth.middleware';
import { Response } from 'express'
import { Controller, Res, Body, Post, Get, Req, UseBefore, Put, Param } from 'routing-controllers';
import { SuccessResponse } from '@utils/response.util';
import { UserPayloadDto } from '@utils/util-types';
import { ResetPasswordDto, SignUpDto, UpdateUserDto } from '../dto/user.dto';
import UserService  from '../services/user.service'
import { UUIDVersion } from 'class-validator';
import uuid from 'uuid'

@Controller('/api/users')
export class UserController {
    private readonly userService: UserService
    constructor(){
        this.userService = new UserService()
    }

    @Post('/')
    async Register(@Body() body:SignUpDto, @Res() res: Response): Promise<UserPayloadDto>{
        const user = await this.userService.register(body)
        return new SuccessResponse('New User Created', { user }).send()
    }

    @Get('/:id')
    @UseBefore(AuthMiddleware)
    async GetCurrentUser(@Req() req: any ): Promise<UserPayloadDto> {
        const { userId } = req.currentUser
        const user = await this.userService.findCurrentUser({id: userId})
        return new SuccessResponse('Current User Found', { user }).send()
    }

    @Post('/reset-password')
    @UseBefore(AuthMiddleware)
    async ResetPassword(@Body() body:ResetPasswordDto, @Req() req: any): Promise<UserPayloadDto> {
        const { userId } = req.currentUser
        const user = await this.userService.updatePassword({id: userId}, body)
        return new SuccessResponse('Password Changed Successfully', { user }).send()
    }

    @Put('/:id')
    @UseBefore(AuthMiddleware)
    async UpdatedUser(@Body() body: UpdateUserDto, @Req() req: any): Promise<UserPayloadDto> {
        const { userId } = req.currentUser
        const user = await this.userService.update({id: userId}, body)
        return new SuccessResponse('Updated User', { user }).send()
    }
}