import { Request } from 'express'
import { Service } from "typedi";
import { ResponseSchema } from 'routing-controllers-openapi';
import { Controller, Get, Req, UseBefore } from "routing-controllers";

import { User } from "@user-module/user.types";
import { GoogleGuard } from '@providers/social/google';
import { SuccessResponse } from "@utils/response.util";
import { FacebookGuard } from '@providers/social/facebook';
import { PlatformService } from "../services/platform.service";
import { TokenService } from '@auth-module/services/token.service';
import { BasePayload, DataLogin, LoginResponse } from "@utils/response.types";

@Service()
@Controller("/api/v1/platforms")
export class PlatformController{
    constructor(
        private platformService: PlatformService,
        private tokenService: TokenService
    ){}

    @Get("/google")
    @UseBefore(GoogleGuard)
    @ResponseSchema(BasePayload)
    async googleAuth(): Promise<BasePayload>{
        return new SuccessResponse("Google login working")
    }

    @Get("/google/redirect")
    @UseBefore(GoogleGuard)
    @ResponseSchema(LoginResponse)
    async googleAuthRedirect(@Req() req: Request): Promise<BasePayload>{
        const data: User = req.user as User
        const user = await this.platformService.create(data)
        const tokens = await this.tokenService.getTokens(user, req.ctx)
        return new SuccessResponse<DataLogin>("Google login working", {user, tokens})
    }

    @Get("/facebook")
    @UseBefore(FacebookGuard)
    @ResponseSchema(BasePayload)
    async facebookAuth(): Promise<BasePayload>{
        return new SuccessResponse("Facebook login working")
    }

    @Get("/facebook/redirect")
    @UseBefore(FacebookGuard)
    @ResponseSchema(LoginResponse)
    async facebookAuthRedirect(@Req() req: Request): Promise<BasePayload>{
        const data: User = req.user as User
        const user = await this.platformService.create(data)
        const tokens = await this.tokenService.getTokens(user, req.ctx)
        return new SuccessResponse<DataLogin>("Facebook login working", {user, tokens})
    }
}