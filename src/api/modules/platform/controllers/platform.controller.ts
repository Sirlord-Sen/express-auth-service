import { Request } from 'express'
import { Service } from "typedi";
import { Controller, Get, Req, UseBefore } from "routing-controllers";

import { User } from "@user-module/user.types";
import { GoogleGuard } from '@providers/social/google';
import { SuccessResponse } from "@utils/response.util";
import { FacebookGuard } from '@providers/social/facebook';
import { LoginResponse, Payload } from "@utils/utility-types";
import { PlatformService } from "../services/platform.service";
import { TokenService } from '@auth-module/services/token.service';

@Service()
@Controller("/api/v1/platforms")
export class PlatformController{
    constructor(
        private platformService: PlatformService,
        private tokenService: TokenService
    ){}

    @Get("/google")
    @UseBefore(GoogleGuard)
    async googleAuth(): Promise<Payload>{
        return new SuccessResponse("Google login working")
    }

    @Get("/google/redirect")
    @UseBefore(GoogleGuard)
    async googleAuthRedirect(@Req() req: Request): Promise<Payload>{
        const data: User = req.user as User
        const user = await this.platformService.create(data)
        const tokens = await this.tokenService.getTokens(user, req.ctx)
        return new SuccessResponse<LoginResponse>("Google login working", {user, tokens})
    }

    @Get("/facebook")
    @UseBefore(FacebookGuard)
    async facebookAuth(): Promise<Payload>{
        return new SuccessResponse("Facebook login working")
    }

    @Get("/facebook/redirect")
    @UseBefore(FacebookGuard)
    async facebookAuthRedirect(@Req() req: Request): Promise<Payload>{
        const data: User = req.user as User
        const user = await this.platformService.create(data)
        const tokens = await this.tokenService.getTokens(user, req.ctx)
        return new SuccessResponse("Facebook login working", {user, tokens})
    }
}