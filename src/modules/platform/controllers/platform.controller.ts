import { FacebookGuard, GoogleGuard } from "@middlewares/guards.middleware";
import { Request } from 'express'
import { SuccessResponse } from "@utils/response.util";
import { Payload } from "@utils/utility-types";
import { Controller, Get, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Service()
@Controller("/api/v1/platforms")
export class PlatformController{
    constructor(

    ){}

    @Get("/google")
    @UseBefore(GoogleGuard)
    async googleAuth(): Promise<Payload>{
        return new SuccessResponse("Google login working")
    }

    @Get("/google/redirect")
    @UseBefore(GoogleGuard)
    async googleAuthRedirect(@Req() req: Request): Promise<Payload>{
        return new SuccessResponse("Google login working", {user: req.user})
    }

    @Get("/facebook")
    @UseBefore(FacebookGuard)
    async facebookAuth(): Promise<Payload>{
        return new SuccessResponse("Facebook login working")
    }

    @Get("/facebook/redirect")
    @UseBefore(FacebookGuard)
    async facebookAuthRedirect(@Req() req: Request): Promise<Payload>{
        return new SuccessResponse("Facebook login working", {user: req.user})
    }
}