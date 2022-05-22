import { AuthMiddleware } from '@middlewares/auth.middleware';
import { Request } from 'express'
import { Service } from 'typedi'
import { Controller, Body, Post, Get, Req, UseBefore, Put } from 'routing-controllers';
import { SuccessResponse } from '@utils/response.util';
import { Payload, UserResponse } from '@utils/utility-types';
import { ResetPasswordDto, SignUpDto, UpdateUserDto } from '../dto/user.dto';
import { UserService }  from '../services/user.service'

@Service()
@Controller('/api/v1/users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('/')
    async Register(@Body() body:SignUpDto): Promise<Payload>{
        await this.userService.register(body)
        return new SuccessResponse('New User Created')
    }

    @Get('/:id')
    @UseBefore(AuthMiddleware)
    async GetCurrentUser(@Req() req: Request ): Promise<Payload> {
        const { userId } = req.currentUser
        const user = await this.userService.findCurrentUser({id: userId})
        return new SuccessResponse<UserResponse>('Current User Found', { user })
    }

    @Put('/:id')
    @UseBefore(AuthMiddleware)
    async UpdatedUser(@Body() body: UpdateUserDto, @Req() req: Request): Promise<Payload> {
        const { userId } = req.currentUser
        const user = await this.userService.update({id: userId}, body)
        return new SuccessResponse<UserResponse>('Updated User', { user })
    }

    @Post('/change-password')
    @UseBefore(AuthMiddleware)
    async ChangePassword(@Body() body:ResetPasswordDto, @Req() req: Request): Promise<Payload> {
        const { userId } = req.currentUser
        const user = await this.userService.updatePassword({id: userId}, body)
        return new SuccessResponse<UserResponse>('Password Changed Successfully', { user })
    }
}