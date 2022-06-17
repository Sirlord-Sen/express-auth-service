import { pick } from "lodash";
import { nanoid } from "nanoid";
import { Service } from 'typedi'

import { ValidateHelper } from "@helpers//";
import { TokenService } from "./token.service";
import { IAuthService } from "../interfaces/service.interface";
import { UserService } from "@user-module/services/user.service";
import { ConflictError, UnauthorizedError } from "@exceptions//";
import { EmailConfirmAccount, EmailResetPassword } from "@providers/mailer/email.util";
import {
    ForgotPasswordRequest, 
    LoginRequest, 
    LogoutRequest, 
    ResetPasswordRequest,  
} from "../auth.types";

@Service()
export class AuthService implements IAuthService{
    constructor(
        private tokenService: TokenService,
        private userService: UserService,
    ){}

    async confirmAccount(token: string){
        const { jti, email } = await this.tokenService.decodeConfirmationToken(token)
        const user = await this.userService.update({email, accountActivationToken: jti}, { isAccountActivated: true, isActive: true })
        new EmailConfirmAccount({email})
        return pick(user, ["id", "username", "email"])
    }

    async login(body: LoginRequest) {
        const { email, password } = body
        const user = await this.userService.findOneOrFail({email})
        const validate = await ValidateHelper.verifyPassword(user.password, password)
        if(!validate) throw new UnauthorizedError("Invalid Login Credentials")
        return pick(user, ["id", "username", "email"])      
    }

    async logout(body: LogoutRequest, ctx: Context) {
        const { refreshToken } = body
        const { jti, sub } = await this.tokenService.decodeRefreshToken(refreshToken)
        await this.tokenService.update({ jti, isRevoked: false } , {isRevoked: true });
        await this.userService.update({id: sub}, {isActive: false});
    }

    async refreshToken(refreshToken: string, ctx: Context) {
        const user   = await this.tokenService.resolveRefreshToken(refreshToken)
        const tokens = await this.tokenService.getTokens(user, ctx)
        return  tokens ;
    }

    // FIX
    // SET EXPIRY FOR CONFIRMTOKENPASSWORD TO BE CLEARED FROM DATABASE AFTER EXPIRY
    async forgotPassword(body: ForgotPasswordRequest) {
        const { email } = body;
        const { id } = await this.userService.findOneOrFail({ email });

        const passwordResetToken = nanoid();
        const { accessToken, expiresAt } = await this.tokenService.generateAccessToken({userId: id, email}, passwordResetToken)

        await this.userService.update({ id }, { passwordResetToken, passwordResetExpires: expiresAt });

        new EmailResetPassword({email, token: accessToken})
        
    }

    async resetPassword(body: ResetPasswordRequest) {
        const { password, token } = body
        const { jti, email } = await this.tokenService.decodeConfirmationToken(token)
        const user = await this.userService.findOneOrFail({email, passwordResetToken: jti})
        const validate = await ValidateHelper.verifyPassword(user.password, password)
        if(validate) throw new ConflictError("Same password")
        const updatedUser = await this.userService.update({email, passwordResetToken: jti}, {password: password})
        new EmailResetPassword({email})
     
        return updatedUser
    }
}