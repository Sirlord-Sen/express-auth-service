import { JsonController, Res, Body, Get, Post, Put, Delete, QueryParam } from 'routing-controllers';
import { UserService } from '../services/user.service'

@JsonController('/api/users')
export class UserController {
    private readonly userService: UserService
    constructor(){
        this.userService = new UserService()
    }

    @Post('/')
    async post(@Body() user: any){
    }
}