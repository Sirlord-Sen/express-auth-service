import UserService from "@user/services/user.service";
import { ConflictError, UnauthorizedError } from "@utils/error-response.util";
import { pick } from "lodash";
import { 
    ForgotPasswordRequest, 
    LoginRequest, 
    LogoutRequest, 
    ResetPasswordRequest, 
    UserAgent 
} from "../auth.types";
import TokenService from "./token.service";
import { nanoid } from "nanoid";
import { IAuthService } from "../interfaces/service.interface";
import { ValidateHelper } from "@helpers//";
import { Service } from 'typedi'
import { EmailConfirmAccount, EmailResetPassword } from "@providers/mailer/email.util";

@Service()
export default class AuthService implements IAuthService{
    constructor(
        private tokenService: TokenService,
        private userService: UserService,
    ){}

    async confirmAccount(token: string){
        const { jti, email } = await this.tokenService.decodeConfirmationToken(token)
        const user = await this.userService.update({email, accountActivationToken: jti}, { isAccountActivated: true })
        new EmailConfirmAccount({email})
        return pick(user, ["id", "username", "email"])
    }

    async login(body: LoginRequest) {
        const { email, password } = body
        const user = await this.userService.findOneOrFail({email})
        const validate = await ValidateHelper.credentials(user.password, password)
        if(!validate) throw new UnauthorizedError("Invalid Login Credentials")
        return pick(user, ["id", "username", "email"])      
    }

    async logout(body: LogoutRequest, useragent: UserAgent) {
        const { userId } = body
        await this.tokenService.update({ userId, ...useragent, isRevoked: false } , {isRevoked: true });
    }

    async refreshToken(refreshToken: string, agent: UserAgent) {
        let user   = await this.tokenService.resolveRefreshToken(refreshToken)
        const tokens = await this.tokenService.getTokens(user, agent)
        return  tokens ;
    }

    // FIX
    // SET EXPIRY FOR CONFIRMTOKENPASSWORD TO BE CLEARED FROM DATABASE AFTER EXPIRY
    async forgotPassword(body: ForgotPasswordRequest) {
        const { email } = body;
        const { id } = await this.userService.findOneOrFail({ email });

        const passwordResetToken = nanoid();
        const { accessToken, expiredAt } = await this.tokenService.generateAccessToken({userId: id, email}, passwordResetToken)

        await this.userService.update({ id }, { passwordResetToken, passwordResetExpires: expiredAt });

        new EmailResetPassword({email, token: accessToken})
        
    }

    async resetPassword(body: ResetPasswordRequest) {
        const { password, token } = body
        const { jti, email } = await this.tokenService.decodeConfirmationToken(token)
        const user = await this.userService.findOneOrFail({email, passwordResetToken: jti})
        const validate = await ValidateHelper.credentials(user.password, password)
        if(validate) throw new ConflictError("Same password")
        const updatedUser = await this.userService.update({email, passwordResetToken: jti}, {password: password})
        new EmailResetPassword({email})
     
        return updatedUser
    }
}