import { Service } from 'typedi'
import { Controller, Body, Post, Get, Put, Authorized, CurrentUser } from 'routing-controllers';
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

    @Authorized()
    @Get('/:id')
    async GetCurrentUser(@CurrentUser() {userId}: CurrentUser ): Promise<Payload> {
        const user = await this.userService.findCurrentUser({id: userId})
        return new SuccessResponse<UserResponse>('Current User Found', { user })
    }

    @Authorized()
    @Put('/:id')
    async UpdatedUser(@Body() body: UpdateUserDto, @CurrentUser() {userId}: CurrentUser): Promise<Payload> {
        const user = await this.userService.update({id: userId}, body)
        return new SuccessResponse<UserResponse>('Updated User', { user })
    }

    @Authorized()
    @Post('/change-password')
    async ChangePassword(@Body() body:ResetPasswordDto, @CurrentUser() {userId}: CurrentUser): Promise<Payload> {
        const user = await this.userService.updatePassword({id: userId}, body)
        return new SuccessResponse<UserResponse>('Password Changed Successfully', { user })
    }
}