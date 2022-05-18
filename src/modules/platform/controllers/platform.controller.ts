import { FacebookGuard, GoogleGuard } from "@middlewares/guards.middleware";
import { Request } from 'express'
import { SuccessResponse } from "@utils/response.util";
import { LoginResponse, Payload } from "@utils/utility-types";
import { Controller, Get, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { PlatformService } from "../services/platform.service";
import { User } from "@modules/user/user.types";
import TokenService from '@auth/services/token.service';

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
        const { useragent } = req
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        const data: User = req.user as User
        const user = await this.platformService.create(data)
        const tokens = await this.tokenService.getTokens(user, userAgent)
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
        const { useragent } = req
        const userAgent = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        const data: User = req.user as User
        const user = await this.platformService.create(data)
        const tokens = await this.tokenService.getTokens(user, userAgent)
        return new SuccessResponse("Facebook login working", {user, tokens})
    }
}