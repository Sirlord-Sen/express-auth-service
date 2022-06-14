import { Service } from 'typedi'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Controller, Body, Post, Get, Put, Authorized, CurrentUser } from 'routing-controllers';

import { SuccessResponse } from '@utils/response.util';
import { UserService }  from '../services/user.service'
import { BasePayload, DataUser, UserResponse } from '@utils/response.types';
import { ChangePasswordDto, SignUpDto, UpdateUserDto } from '../dto/user.dto';

@Service()
@Controller('/api/v1/users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('/')
    async Register(@Body() body:SignUpDto): Promise<BasePayload>{
        await this.userService.register(body)
        return new SuccessResponse('New User Created')
    }

    
    @Get('/:id')
    @Authorized()
    @ResponseSchema(UserResponse)
    async GetCurrentUser(@CurrentUser() {userId}: CurrentUser ): Promise<BasePayload> {
        const user = await this.userService.findCurrentUser({id: userId})
        return new SuccessResponse<DataUser>('Current User Found', { user })
    }

    
    @Put('/:id')
    @Authorized()
    @ResponseSchema(UserResponse)
    async UpdatedUser(@Body() body: UpdateUserDto, @CurrentUser() {userId}: CurrentUser): Promise<BasePayload> {
        const user = await this.userService.update({id: userId}, body)
        return new SuccessResponse<DataUser>('Updated User', { user })
    }

    
    @Post('/change-password')
    @Authorized()
    @ResponseSchema(UserResponse)
    async ChangePassword(@Body() body:ChangePasswordDto, @CurrentUser() {userId}: CurrentUser): Promise<BasePayload> {
        const user = await this.userService.updatePassword({id: userId}, body)
        return new SuccessResponse<DataUser>('Password Changed Successfully', { user })
    }
}